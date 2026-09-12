export type SourceType = "pdf" | "web" | "youtube";

export interface SourceInfo {
  title: string;
  type: SourceType | string;
}

export interface Citation {
  id: number;
  type: string;
  title: string;
  source: string;
  page: number | null;
  snippet: string;
}

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  citations?: Citation[];
  /** Present when an assistant message failed to generate. */
  error?: string;
  createdAt: number;
}

/**
 * Fine-grained states for the AI research experience, shown in the status
 * banner and empty state so the user always knows what's happening.
 */
export type AssistantStatus =
  | "idle"
  | "preparing"
  | "searching"
  | "processing"
  | "generating"
  | "completed"
  | "error";

export interface RecentSource {
  id: string;
  title: string;
  type: SourceType | string;
  addedAt: number;
}
