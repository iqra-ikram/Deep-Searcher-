import type { ChatMessage, Citation, SourceInfo, SourceType } from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data?.detail === "string") return data.detail;
  } catch {
    // response wasn't JSON — fall through to the generic message
  }
  return fallback;
}

export async function checkHealth(signal?: AbortSignal): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { signal });
    return response.ok;
  } catch {
    return false;
  }
}

export async function processWebsite(userid: string, url: string): Promise<SourceInfo> {
  const response = await fetch(`${API_BASE_URL}/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userid, source: url, source_type: "web" }),
  });

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response, "Failed to process that website."), response.status);
  }

  const data = await response.json();
  return data.source as SourceInfo;
}

export async function processYoutube(userid: string, url: string): Promise<SourceInfo> {
  const response = await fetch(`${API_BASE_URL}/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userid, source: url, source_type: "youtube" }),
  });

  if (!response.ok) {
    throw new ApiError(
      await parseErrorMessage(response, "Failed to process that YouTube video."),
      response.status
    );
  }

  const data = await response.json();
  return data.source as SourceInfo;
}

export async function processPdf(userid: string, file: File): Promise<SourceInfo> {
  const formData = new FormData();
  formData.append("userid", userid);
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/process-pdf`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response, "Failed to process that PDF."), response.status);
  }

  const data = await response.json();
  return data.source as SourceInfo;
}

export async function processSource(
  userid: string,
  sourceType: SourceType,
  value: string | File
): Promise<SourceInfo> {
  if (sourceType === "pdf") return processPdf(userid, value as File);
  if (sourceType === "web") return processWebsite(userid, value as string);
  return processYoutube(userid, value as string);
}

export async function askQuestion(
  userid: string,
  question: string,
  history: ChatMessage[]
): Promise<{ answer: string; citations: Citation[] }> {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userid,
      question,
      history: history
        .filter((m) => !m.error)
        .slice(-20)
        .map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response, "The assistant failed to respond."), response.status);
  }

  return response.json();
}

export async function resetSession(userid: string): Promise<void> {
  await fetch(`${API_BASE_URL}/session/${userid}`, { method: "DELETE" }).catch(() => {
    // Best-effort — the frontend will still clear local state.
  });
}
