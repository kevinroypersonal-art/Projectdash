import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClass: Record<Variant, string> = {
  outline:
    "border border-[color:var(--color-border-strong)] text-[color:var(--color-fg)] hover:border-white hover:bg-white/[0.03]",
  ghost: "text-[color:var(--color-fg-muted)] hover:text-white hover:bg-white/[0.04]",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-sm",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "outline", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.08em] transition-colors",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          variantClass[variant],
          sizeClass[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
