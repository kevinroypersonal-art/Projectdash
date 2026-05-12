"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const next = resolvedTheme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      aria-label={`Switch to ${mounted ? next : "light"} theme`}
      onClick={() => setTheme(next)}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center border border-[color:var(--color-border)] text-[color:var(--color-fg-muted)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-fg)]",
        className,
      )}
    >
      {mounted && resolvedTheme === "light" ? (
        <Moon className="h-3.5 w-3.5" />
      ) : (
        <Sun className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
