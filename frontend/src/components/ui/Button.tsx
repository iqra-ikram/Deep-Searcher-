import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-accent text-[var(--accent-contrast)] shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_8px_20px_-12px_rgba(98,230,200,0.9)] hover:bg-accent-strong disabled:hover:bg-accent",
  secondary:
    "bg-surface-hover text-text border border-border-strong hover:bg-surface-active",
  ghost: "bg-transparent text-text-muted hover:bg-surface-hover hover:text-text",
  danger: "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium tracking-[0.01em] transition-all duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
