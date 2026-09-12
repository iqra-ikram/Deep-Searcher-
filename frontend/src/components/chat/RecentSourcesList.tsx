import { FileText, Globe } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import type { RecentSource } from "@/lib/types";

const TYPE_ICON: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-3.5 w-3.5" />,
  website: <Globe className="h-3.5 w-3.5" />,
  youtube: <FaYoutube className="h-3.5 w-3.5 text-red-500" />,
};

export default function RecentSourcesList({ items }: { items: RecentSource[] }) {
  if (items.length === 0) {
    return (
      <p className="px-1 text-xs text-text-dim">
        Sources you analyze in this browser will show up here.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-xs text-text-muted"
        >
          <span className="shrink-0 text-text-dim">{TYPE_ICON[item.type] ?? <FileText className="h-3.5 w-3.5" />}</span>
          <span className="truncate">{item.title}</span>
        </li>
      ))}
    </ul>
  );
}
