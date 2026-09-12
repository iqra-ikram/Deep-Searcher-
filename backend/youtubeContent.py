import os
from urllib.parse import parse_qs, urlparse

from dotenv import load_dotenv
from langchain_core.documents import Document
from langdetect import LangDetectException, detect
from youtube_transcript_api import (
    NoTranscriptFound,
    TranscriptsDisabled,
    VideoUnavailable,
    YouTubeTranscriptApi,
)

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

_groq_client = None


class YoutubeProcessingError(Exception):
    """Raised for any recoverable failure while loading YouTube content."""


def _get_groq_client():
    """Lazily create the Groq client so a missing key only breaks
    translation (used for non-English transcripts), not the whole app."""

    global _groq_client

    if _groq_client is None:
        if not GROQ_API_KEY:
            raise YoutubeProcessingError(
                "This video's transcript needs translation, but GROQ_API_KEY is not configured on the backend."
            )
        from groq import Groq

        _groq_client = Groq(api_key=GROQ_API_KEY, timeout=120)

    return _groq_client


# ----------------------------------------
# Extract YouTube Video ID
# ----------------------------------------

def extract_video_id(url: str) -> str:
    parsed = urlparse(url)

    if "youtube.com" in parsed.netloc:
        video_id = parse_qs(parsed.query).get("v")
        if not video_id:
            raise YoutubeProcessingError("Could not find a video ID in that YouTube URL.")
        return video_id[0]

    if "youtu.be" in parsed.netloc:
        video_id = parsed.path.lstrip("/")
        if not video_id:
            raise YoutubeProcessingError("Could not find a video ID in that YouTube URL.")
        return video_id

    raise YoutubeProcessingError("That doesn't look like a valid YouTube URL.")


# ----------------------------------------
# Get Any Available Transcript
# ----------------------------------------

def get_any_transcript(video_id: str) -> str:
    try:
        # youtube-transcript-api 0.6.x exposes static helpers, while newer
        # releases expose instance fetch/list methods.
        if hasattr(YouTubeTranscriptApi, "get_transcript"):
            data = YouTubeTranscriptApi.get_transcript(video_id)
            return " ".join(item["text"] for item in data)

        api = YouTubeTranscriptApi()
        if hasattr(api, "fetch"):
            return " ".join(item.text for item in api.fetch(video_id))

        transcript_list = api.list(video_id)
        available = list(transcript_list)

        if not available:
            raise YoutubeProcessingError("This YouTube video does not have any available transcripts.")

        return " ".join(item.text for item in available[0].fetch())

    except YoutubeProcessingError:
        raise
    except NoTranscriptFound as exc:
        raise YoutubeProcessingError("No transcript is available for this YouTube video.") from exc
    except TranscriptsDisabled as exc:
        raise YoutubeProcessingError("Transcripts are disabled for this YouTube video.") from exc
    except VideoUnavailable as exc:
        raise YoutubeProcessingError("This YouTube video is unavailable or does not exist.") from exc
    except Exception as exc:  # noqa: BLE001
        raise YoutubeProcessingError(f"Failed to retrieve the transcript: {exc}") from exc


# ----------------------------------------
# Translate to English
# ----------------------------------------

def translate_to_english(text: str) -> str:
    client = _get_groq_client()

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": """You are a professional translator.

Translate the following transcript into fluent English.

Rules:
- Preserve meaning.
- Do not summarize.
- Do not explain.
- Return only the English translation.""",
            },
            {"role": "user", "content": text},
        ],
    )

    return response.choices[0].message.content.strip()


# ----------------------------------------
# Loader used by RAG Pipeline
# ----------------------------------------

def load_youtube_content(url: str) -> list[Document]:
    video_id = extract_video_id(url)
    transcript = get_any_transcript(video_id)

    if not transcript.strip():
        raise YoutubeProcessingError("The transcript for this video is empty.")

    try:
        language = detect(transcript)
    except LangDetectException:
        language = "en"

    if language != "en":
        transcript = translate_to_english(transcript)

    return [
        Document(
            page_content=transcript,
            metadata={
                "source": url,
                "type": "youtube",
                "title": f"YouTube video ({video_id})",
            },
        )
    ]
