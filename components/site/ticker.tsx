import { positions, pctChange } from "@/lib/positions";
import { formatPct, formatPrice } from "@/lib/utils";

export function Ticker() {
  const rows = positions.slice(0, 6);
  const stream = [...rows, ...rows];

  return (
    <div
      aria-label="Latest positions ticker"
      className="relative w-full overflow-hidden border-y border-[color:var(--color-border)] bg-[color:var(--color-bg)]/80 backdrop-blur"
    >
      <div className="ticker-track flex w-max gap-10 py-3 font-mono text-[11px] uppercase tracking-[0.18em]">
        {stream.map((p, i) => {
          const pnl = pctChange(p);
          return (
            <span
              key={`${p.ticker}-${i}`}
              className="flex items-center gap-3 whitespace-nowrap"
            >
              <span className="text-[color:var(--color-fg-subtle)]">
                {p.date}
              </span>
              <span className="text-[color:var(--color-fg)]">{p.ticker}</span>
              <span className="text-[color:var(--color-fg-muted)]">
                {p.direction}
              </span>
              <span className="text-[color:var(--color-fg-muted)]">
                {formatPrice(p.entry)}
              </span>
              <span
                className={
                  pnl >= 0
                    ? "text-[color:var(--color-fg)]"
                    : "text-[color:var(--color-fg-subtle)]"
                }
              >
                {formatPct(pnl)}
              </span>
              <span className="text-[color:var(--color-fg-subtle)]">·</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
