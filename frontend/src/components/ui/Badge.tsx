import { ReactNode } from "react";

type Tone = "neutral" | "accent" | "violet" | "amber" | "danger";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-surface-hover text-text-muted border-border-strong",
  accent: "bg-accent-soft text-accent border-accent/30",
  violet: "bg-violet-soft text-violet border-violet/30",
  amber: "bg-amber-soft text-amber border-amber/30",
  danger: "bg-danger-soft text-danger border-danger/30",
};

export default function Badge({
  children,
  tone = "neutral",
  icon,
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
