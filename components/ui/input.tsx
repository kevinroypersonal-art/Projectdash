import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-10 w-full bg-transparent border border-[color:var(--color-border-strong)]",
      "px-3 text-sm text-[color:var(--color-fg)] placeholder:text-[color:var(--color-fg-subtle)]",
      "transition-colors focus:border-[color:var(--color-fg)] focus:outline-none",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
