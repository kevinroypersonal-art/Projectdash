"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = { count?: number; className?: string };

export function Meteors({ count = 20, className }: Props) {
  const meteors = React.useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        // Deterministic-but-varied positions to avoid hydration mismatch.
        const seed = (i + 1) * 9301;
        const rand = (n: number) => ((seed * (n + 1)) % 1000) / 1000;
        return {
          id: i,
          left: `${Math.floor(rand(1) * 100)}%`,
          top: `${Math.floor(rand(2) * -100)}%`,
          delay: `${(rand(3) * 5).toFixed(2)}s`,
          duration: `${(4 + rand(4) * 6).toFixed(2)}s`,
        };
      }),
    [count],
  );

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {meteors.map((m) => (
        <span
          key={m.id}
          className="meteor"
          style={{
            left: m.left,
            top: m.top,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
        />
      ))}
    </div>
  );
}
