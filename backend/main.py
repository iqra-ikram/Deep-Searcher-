import logging
import os
import re
import time
from typing import List, Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from rag_pipeline import SourceProcessingError, ask_question, process_source
from youtubeContent import YoutubeProcessingError

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("research-assistant")

app = FastAPI(title="AI Research Assistant API", version="1.0.0")

# Comma-separated list of allowed frontend origins, e.g.
# "http://localhost:3000,https://myapp.vercel.app"
_allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
ALLOWED_ORIGINS = [origin.strip() for origin in _allowed_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type"],
)

# In-memory per-session store. This is intentionally simple (no database):
# each browser session gets a random id and its own processed source +
# retrieval chain. Restarting the server clears all sessions.
#
# Two safeguards keep this from growing unbounded on a long-running server:
# idle sessions expire after SESSION_TTL_SECONDS, and if the store still
# exceeds MAX_SESSIONS the oldest entries are evicted first.
session_store: dict[str, dict] = {}

SESSION_TTL_SECONDS = int(os.getenv("SESSION_TTL_SECONDS", str(60 * 60 * 6)))  # 6 hours
MAX_SESSIONS = int(os.getenv("MAX_SESSIONS", "200"))

MAX_HISTORY_MESSAGES = 20
MAX_HISTORY_CHARS = int(os.getenv("MAX_HISTORY_CHARS", "20000"))
USERID_PATTERN = re.compile(r"^[a-zA-Z0-9_-]{4,64}$")


def _cleanup_sessions() -> None:
    """Opportunistic cleanup, run at the start of every request that touches
    the session store. Cheap for the size this store is expected to reach,
    and avoids needing a background thread/scheduler."""

    now = time.time()
    expired = [uid for uid, entry in session_store.items() if now - entry["processed_at"] > SESSION_TTL_SECONDS]
    for uid in expired:
        session_store.pop(uid, None)

    if len(session_store) > MAX_SESSIONS:
        oldest_first = sorted(session_store.items(), key=lambda kv: kv[1]["processed_at"])
        for uid, _entry in oldest_first[: len(session_store) - MAX_SESSIONS]:
            session_store.pop(uid, None)


def _trim_history(history: list) -> list:
    """Caps history by both message count and total characters, trimming
    from the oldest messages first, so a handful of very long messages can't
    bypass the message-count limit and blow up token usage."""

    trimmed = history[-MAX_HISTORY_MESSAGES:]

    total_chars = sum(len(m.content) for m in trimmed)
    while total_chars > MAX_HISTORY_CHARS and len(trimmed) > 1:
        removed = trimmed.pop(0)
        total_chars -= len(removed.content)

    return trimmed


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class SourceRequest(BaseModel):
    userid: str
    source: str = Field(..., min_length=1, max_length=2048)
    source_type: Literal["web", "youtube"]

    @field_validator("userid")
    @classmethod
    def validate_userid(cls, v: str) -> str:
        if not USERID_PATTERN.match(v):
            raise ValueError("Invalid session id.")
        return v


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., max_length=8000)


class QuestionRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    userid: str
    history: List[ChatMessage] = Field(default_factory=list)

    @field_validator("userid")
    @classmethod
    def validate_userid(cls, v: str) -> str:
        if not USERID_PATTERN.match(v):
            raise ValueError("Invalid session id.")
        return v


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/process-pdf")
def process_pdf(userid: str = Form(...), file: UploadFile = File(...)):
    if not USERID_PATTERN.match(userid):
        raise HTTPException(status_code=400, detail="Invalid session id.")

    _cleanup_sessions()

    try:
        entry = process_source(file, "pdf")
    except (SourceProcessingError, YoutubeProcessingError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception:
        logger.exception("Unexpected error processing PDF")
        raise HTTPException(status_code=500, detail="Failed to process this PDF. Please try again.")

    session_store[userid] = {**entry, "processed_at": time.time()}

    return {
        "message": "PDF processed successfully",
        "source": {"title": entry["title"], "type": entry["type"]},
    }


@app.post("/process")
def process(request: SourceRequest):
    _cleanup_sessions()

    try:
        entry = process_source(request.source, request.source_type)
    except (SourceProcessingError, YoutubeProcessingError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception:
        logger.exception("Unexpected error processing source")
        raise HTTPException(status_code=500, detail="Failed to process this source. Please try again.")

    session_store[request.userid] = {**entry, "processed_at": time.time()}

    return {
        "message": "Source processed successfully",
        "source": {"title": entry["title"], "type": entry["type"]},
    }


@app.post("/ask")
def ask(request: QuestionRequest):
    _cleanup_sessions()

    entry = session_store.get(request.userid)

    if entry is None:
        raise HTTPException(status_code=404, detail="No source has been processed for this session yet.")

    # Cap history by both message count and total characters, so a handful
    # of very long messages can't bypass the count limit and blow up
    # token usage / latency.
    history = _trim_history(request.history)

    try:
        result = ask_question(entry, request.question, history)
    except (SourceProcessingError, YoutubeProcessingError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception:
        logger.exception("Unexpected error answering question")
        raise HTTPException(status_code=500, detail="The assistant failed to respond. Please try again.")

    entry["processed_at"] = time.time()  # mark as recently active so the TTL is based on last use

    return {
        "answer": result["answer"],
        "citations": result["citations"],
    }


@app.delete("/session/{userid}")
def reset_session(userid: str):
    if not USERID_PATTERN.match(userid):
        raise HTTPException(status_code=400, detail="Invalid session id.")

    session_store.pop(userid, None)
    return {"message": "Session reset"}


@app.get("/session/{userid}")
def get_session(userid: str):
    if not USERID_PATTERN.match(userid):
        raise HTTPException(status_code=400, detail="Invalid session id.")

    entry = session_store.get(userid)

    if entry is None:
        return {"active": False}

    return {"active": True, "source": {"title": entry["title"], "type": entry["type"]}}
