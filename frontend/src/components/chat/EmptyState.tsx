import type { SourceInfo } from "@/lib/types";

export default function EmptyState({
  source,
}: {
  source: SourceInfo | null;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      {source ? (
        <>
          <h2 className="mb-2 text-xl font-semibold text-text">Ready when you are</h2>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-text-muted">
            <span className="font-medium text-text">{source.title}</span> has been indexed. Ask
            anything about it — answers are grounded strictly in this source.
          </p>
        </>
      ) : (
        <>
          <h2 className="mb-2 text-xl font-semibold text-text">Add a source to get started</h2>
          <p className="max-w-md text-sm leading-relaxed text-text-muted">
            Choose a PDF, website, or YouTube video from the sidebar. Once it&apos;s indexed, you can
            ask questions and get answers backed by real citations.
          </p>
        </>
      )}
    </div>
  );
}
