export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[var(--radius-sm)] bg-surface-hover ${className}`}
      aria-hidden="true"
    />
  );
}
