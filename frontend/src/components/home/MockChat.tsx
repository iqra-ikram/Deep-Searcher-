import { Bot, FileText, Globe, User } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import Container from "@/components/layout/Container";

export default function MockChat() {
  return (
    <section className="pb-24" aria-label="Product preview">
      <Container>
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-[var(--shadow-lg)]">
          <div className="flex items-center gap-3 border-b border-border px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Bot size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">AI Research Assistant</p>
              <p className="text-xs text-accent">● Ready</p>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div className="flex justify-end">
              <div className="max-w-md rounded-[var(--radius-lg)] rounded-tr-sm bg-surface-hover px-4 py-3 text-sm text-text">
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-text-muted">
                  <User size={13} /> You
                </div>
                Summarize this paper&apos;s key findings and how they cite prior work.
              </div>
            </div>

            <div className="flex justify-start">
              <div className="max-w-xl rounded-[var(--radius-lg)] rounded-tl-sm border border-border bg-bg-elevated px-4 py-3 text-sm">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-accent">
                  <Bot size={13} /> Assistant
                </div>
                <p className="leading-relaxed text-text-muted">
                  The paper introduces Retrieval-Augmented Generation to improve factual
                  accuracy by combining vector search with large language models.
                </p>

                <div className="mt-4 rounded-[var(--radius-md)] border border-border bg-surface p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-dim">Sources</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 rounded-full bg-surface-hover px-2.5 py-1 text-xs text-text-muted">
                      <FileText size={12} /> PDF · p. 5
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full bg-surface-hover px-2.5 py-1 text-xs text-text-muted">
                      <Globe size={12} /> Website
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full bg-surface-hover px-2.5 py-1 text-xs text-text-muted">
                      <FaYoutube className="text-red-500" size={12} /> Video 08:12
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border bg-bg-elevated px-6 py-4">
            <div className="flex items-center rounded-[var(--radius-md)] border border-border-strong bg-surface px-4 py-2.5">
              <span className="flex-1 text-sm text-text-dim">Ask anything about your source…</span>
              <span className="rounded-[var(--radius-sm)] bg-accent px-3 py-1.5 text-xs font-semibold text-[var(--accent-contrast)]">
                Send
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
