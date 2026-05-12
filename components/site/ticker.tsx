import { positions, pctChange } from "@/lib/positions";
import { formatPct, formatPrice } from "@/lib/utils";

export function Ticker() {
  const rows = positions.slice(0, 6);
  const stream = [...rows, ...rows];

  return (
    <div
      aria-label="Latest positions ticker"
      // Locked to the dark Bloomberg-style chrome on both themes.
      className="relative w-full overflow-hidden border-y border-neutral-800 bg-black"
    >
      <div className="ticker-track flex w-max gap-10 py-3 font-mono text-[11px] uppercase tracking-[0.18em]">
        {stream.map((p, i) => {
          const pnl = pctChange(p);
          return (
            <span
              key={`${p.ticker}-${i}`}
              className="flex items-center gap-3 whitespace-nowrap"
            >
              <span className="text-neutral-500">{p.date}</span>
              <span className="text-white">{p.ticker}</span>
              <span className="text-neutral-400">{p.direction}</span>
              <span className="text-neutral-400">{formatPrice(p.entry)}</span>
              <span className={pnl >= 0 ? "text-white" : "text-neutral-500"}>
                {formatPct(pnl)}
              </span>
              <span className="text-neutral-600">·</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
