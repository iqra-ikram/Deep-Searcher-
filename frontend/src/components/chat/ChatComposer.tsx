"use client";

import { KeyboardEvent, useRef } from "react";
import { CornerDownLeft, SendHorizontal } from "lucide-react";
import IconButton from "@/components/ui/IconButton";

export default function ChatComposer({
  value,
  onChange,
  onSend,
  disabled,
  hasSource,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  hasSource: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  }

  return (
    <div className="border-t border-border bg-bg-elevated px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-2 rounded-[var(--radius-lg)] border border-border-strong bg-surface p-2 shadow-[var(--shadow-sm)] transition-colors focus-within:border-accent/50">
          <label htmlFor="chat-input" className="sr-only">
            Ask a question about your source
          </label>
          <textarea
            id="chat-input"
            ref={textareaRef}
            rows={1}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasSource ? "Ask anything about your source…" : "Add a source to start asking questions…"}
            className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-text outline-none placeholder:text-text-dim disabled:cursor-not-allowed"
          />
          <IconButton
            aria-label="Send message"
            disabled={disabled || !value.trim()}
            onClick={onSend}
            className="h-10 w-10 shrink-0 rounded-[var(--radius-md)] bg-accent text-[var(--accent-contrast)] hover:bg-accent-strong hover:text-[var(--accent-contrast)] disabled:bg-surface-hover disabled:text-text-dim"
          >
            <SendHorizontal className="h-4 w-4" />
          </IconButton>
        </div>

        <p className="mt-2 flex items-center gap-1 px-1 text-[11px] text-text-dim">
          <CornerDownLeft className="h-3 w-3" /> to send
          <span aria-hidden="true">·</span>
          Shift + Enter for a new line
        </p>
      </div>
    </div>
  );
}
