import { Menu } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { SourceInfo } from "@/lib/types";

export default function ChatHeader({
  onMenuClick,
  source,
}: {
  onMenuClick: () => void;
  source: SourceInfo | null;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-bg-elevated px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="rounded-[var(--radius-sm)] p-1.5 text-text-muted hover:bg-surface-hover lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" className="text-sm font-semibold text-text hover:text-accent">
          AI Research Assistant
        </Link>
      </div>

      {source ? (
        <Badge tone="accent" className="hidden sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {source.title}
        </Badge>
      ) : (
        <Badge tone="neutral" className="hidden sm:inline-flex">
          No source yet
        </Badge>
      )}
    </header>
  );
}
