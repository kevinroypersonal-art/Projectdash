import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "outline" | "muted";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  outline: "border-white/40 text-white",
  muted:
    "border-[color:var(--color-border-strong)] text-[color:var(--color-fg-muted)]",
};

export function Badge({ className, variant = "outline", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.12em]",
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
}
