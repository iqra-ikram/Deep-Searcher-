"use client";

import { useState } from "react";
import { AlertTriangle, Bot, Check, Copy, RotateCcw, User } from "lucide-react";
import { toast } from "sonner";
import IconButton from "@/components/ui/IconButton";
import CitationList from "./CitationList";
import type { ChatMessage } from "@/lib/types";

export default function MessageBubble({
  message,
  onRetry,
}: {
  message: ChatMessage;
  onRetry?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy to clipboard.");
    }
  }

  return (
    <div className={`animate-fade-in flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-surface-hover text-text-muted" : "bg-accent-soft text-accent"
        }`}
        aria-hidden="true"
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={`group flex max-w-[80%] flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-[var(--radius-lg)] px-4 py-3 text-sm leading-relaxed shadow-[var(--shadow-sm)] ${
            isUser
              ? "rounded-tr-sm bg-surface-hover text-text"
              : message.error
                ? "rounded-tl-sm border border-danger/30 bg-danger-soft text-text"
                : "rounded-tl-sm border border-border bg-surface text-text"
          }`}
        >
          {message.error ? (
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
              <p>{message.error}</p>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}

          {!isUser && !message.error && message.citations && message.citations.length > 0 && (
            <CitationList citations={message.citations} />
          )}
        </div>

        {!isUser && (
          <div className="mt-1 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            {!message.error && message.content && (
              <IconButton aria-label="Copy response" onClick={handleCopy} className="h-7 w-7">
                {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
              </IconButton>
            )}
            {onRetry && (
              <IconButton aria-label="Retry this message" onClick={onRetry} className="h-7 w-7">
                <RotateCcw className="h-3.5 w-3.5" />
              </IconButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
