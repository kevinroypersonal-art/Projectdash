import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group relative border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/40",
        "transition-colors hover:border-white/40 hover:ring-1 hover:ring-white/10",
        className,
      )}
      {...props}
    />
  );
}
