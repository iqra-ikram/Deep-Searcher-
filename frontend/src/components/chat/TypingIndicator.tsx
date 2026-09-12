import { Bot } from "lucide-react";
import StatusBanner from "./StatusBanner";
import type { AssistantStatus } from "@/lib/types";

export default function TypingIndicator({ status }: { status: AssistantStatus }) {
  return (
    <div className="animate-fade-in flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Bot className="h-4 w-4" />
      </div>

      <div className="flex flex-col gap-2 rounded-[var(--radius-lg)] rounded-tl-sm border border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-text-dim" />
          <span
            className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-text-dim"
            style={{ animationDelay: "0.15s" }}
          />
          <span
            className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-text-dim"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
        <StatusBanner status={status} />
      </div>
    </div>
  );
}
