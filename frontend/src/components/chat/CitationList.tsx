"use client";

import { useState } from "react";
import { ChevronDown, FileText, Globe } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import type { Citation } from "@/lib/types";

const TYPE_ICON: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-3.5 w-3.5" />,
  website: <Globe className="h-3.5 w-3.5" />,
  youtube: <FaYoutube className="h-3.5 w-3.5 text-red-500" />,
};

export default function CitationList({ citations }: { citations: Citation[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-4 rounded-[var(--radius-md)] border border-border bg-bg-elevated/60 p-3">
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-text-dim">
        Sources ({citations.length})
      </p>

      <div className="flex flex-col gap-1.5">
        {citations.map((citation) => {
          const isOpen = expandedId === citation.id;

          return (
            <div
              key={citation.id}
              className="overflow-hidden rounded-[var(--radius-sm)] border border-border bg-surface"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : citation.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-text-muted transition-colors hover:bg-surface-hover"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-hover text-text-dim">
                  {citation.id}
                </span>

                <span className="shrink-0 text-text-dim">
                  {TYPE_ICON[citation.type] ?? <FileText className="h-3.5 w-3.5" />}
                </span>

                <span className="flex-1 truncate font-medium text-text">
                  {citation.title}
                  {citation.page !== null && citation.page !== undefined ? ` · p.${citation.page + 1}` : ""}
                </span>

                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="animate-fade-in border-t border-border px-3 py-2.5">
                  {citation.snippet && (
                    <p className="mb-2 text-xs leading-relaxed text-text-muted">“{citation.snippet}”</p>
                  )}
                  {citation.source && (
                    <p className="truncate text-[11px] text-text-dim">{citation.source}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
