import { FileText, Globe } from "lucide-react";
import { FaYoutube } from "react-icons/fa";

const SOURCES = [
  { title: "PDF", subtitle: "Research papers, resumes, docs", icon: <FileText size={22} /> },
  { title: "Website", subtitle: "Any public, readable webpage", icon: <Globe size={22} /> },
  { title: "YouTube", subtitle: "Videos with a transcript", icon: <FaYoutube size={22} className="text-red-500" /> },
];

export default function SupportedSources() {
  return (
    <div className="mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-3">
      {SOURCES.map((source) => (
        <div
          key={source.title}
          className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 text-left transition-colors hover:border-accent/30"
        >
          <div className="mb-3 text-accent">{source.icon}</div>
          <h3 className="text-sm font-semibold text-text">{source.title}</h3>
          <p className="mt-1 text-xs text-text-muted">{source.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
