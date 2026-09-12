"use client";

import { Bot, FileText, Globe, Plus, ShieldCheck, X } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import SourcePanel from "./SourcePanel";
import RecentSourcesList from "./RecentSourcesList";
import type { RecentSource, SourceInfo } from "@/lib/types";

const TYPE_ICON: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-4 w-4" />,
  website: <Globe className="h-4 w-4" />,
  youtube: <FaYoutube className="h-4 w-4 text-red-500" />,
};

export default function Sidebar({
  open,
  onClose,
  source,
  isProcessing,
  onSubmitUrl,
  onSubmitFile,
  onNewSession,
  recentSources,
}: {
  open: boolean;
  onClose: () => void;
  source: SourceInfo | null;
  isProcessing: boolean;
  onSubmitUrl: (type: "web" | "youtube", url: string) => void;
  onSubmitFile: (file: File) => void;
  onNewSession: () => void;
  recentSources: RecentSource[];
}) {
  return (
    <>
      {/* Mobile scrim */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-bg-elevated transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Source management"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <h1 className="text-sm font-semibold text-text">Research Assistant</h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-[var(--radius-sm)] p-1.5 text-text-muted hover:bg-surface-hover lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <Button variant="secondary" size="sm" className="mb-5 w-full" onClick={onNewSession}>
            <Plus className="h-4 w-4" /> New session
          </Button>

          <div className="study-helper-glow mb-6 rounded-[var(--radius-lg)] border border-accent/20 bg-accent-soft p-3.5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-bg text-accent">
                <Bot className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-text">Study helper</p>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-label="Online" />
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
                  Grounded answers from your active source.
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 border-t border-accent/15 pt-2.5 text-[10px] font-medium uppercase tracking-[0.12em] text-text-dim">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Source-aware mode
            </div>
          </div>

          {source ? (
            <div className="mb-6 rounded-[var(--radius-md)] border border-border bg-surface p-3.5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-dim">
                Active source
              </p>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-text-dim">{TYPE_ICON[source.type] ?? <FileText className="h-4 w-4" />}</span>
                <p className="break-words text-sm text-text">{source.title}</p>
              </div>
              <Badge tone="accent" className="mt-3">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Indexed & ready
              </Badge>
            </div>
          ) : (
            <p className="mb-5 text-xs leading-relaxed text-text-dim">
              Choose a source below. Once it&apos;s processed, you can ask questions grounded in its
              content.
            </p>
          )}

          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-dim">
            {source ? "Replace source" : "Choose a source"}
          </p>

          <SourcePanel isProcessing={isProcessing} onSubmitUrl={onSubmitUrl} onSubmitFile={onSubmitFile} />

          <div className="mt-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-dim">
              Recent in this browser
            </p>
            <RecentSourcesList items={recentSources} />
          </div>
        </div>
      </aside>
    </>
  );
}
