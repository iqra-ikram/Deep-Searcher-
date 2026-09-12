import { Bot, WifiOff } from "lucide-react";

export default function BackendConnecting({ unreachable }: { unreachable: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg px-6 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft">
        {unreachable ? <WifiOff className="h-6 w-6 text-danger" /> : <Bot className="h-6 w-6 animate-pulse text-accent" />}
      </div>

      <h1 className="text-xl font-semibold text-text">
        {unreachable ? "Can't reach the backend" : "Connecting to the AI server…"}
      </h1>

      <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-muted">
        {unreachable ? (
          <>
            Make sure the FastAPI backend is running (
            <code className="rounded bg-surface-hover px-1.5 py-0.5 text-xs">uvicorn main:app --reload</code>
            ) and that <code className="rounded bg-surface-hover px-1.5 py-0.5 text-xs">NEXT_PUBLIC_API_URL</code>{" "}
            points to it.
          </>
        ) : (
          "This usually only takes a moment."
        )}
      </p>

      {!unreachable && (
        <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-surface-hover">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-accent" />
        </div>
      )}
    </div>
  );
}
