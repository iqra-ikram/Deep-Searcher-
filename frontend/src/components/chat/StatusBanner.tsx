import { AlertTriangle, FileSearch, Loader2 } from "lucide-react";
import type { AssistantStatus } from "@/lib/types";

const CONFIG: Record<
  Exclude<AssistantStatus, "idle" | "completed">,
  { label: string; icon: React.ReactNode; tone: string }
> = {
  preparing: {
    label: "Preparing your request…",
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    tone: "text-text-muted",
  },
  searching: {
    label: "Searching the source for relevant passages…",
    icon: <FileSearch className="h-3.5 w-3.5" />,
    tone: "text-violet",
  },
  processing: {
    label: "Analyzing retrieved context…",
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    tone: "text-violet",
  },
  generating: {
    label: "Generating a grounded answer…",
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    tone: "text-accent",
  },
  error: {
    label: "Something went wrong.",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    tone: "text-danger",
  },
};

export default function StatusBanner({ status }: { status: AssistantStatus }) {
  if (status === "idle" || status === "completed") return null;

  const config = CONFIG[status];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`animate-fade-in flex items-center gap-2 text-xs font-medium ${config.tone}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}
