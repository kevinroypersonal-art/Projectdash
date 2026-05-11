export type Direction = "LONG" | "SHORT";
export type Status = "OPEN" | "CLOSED";

export type Position = {
  date: string;
  ticker: string;
  direction: Direction;
  entry: number;
  current: number;
  status: Status;
  thesis: string;
};

export const positions: Position[] = [
  {
    date: "2026-04-22",
    ticker: "NVDA",
    direction: "LONG",
    entry: 842.15,
    current: 1014.6,
    status: "OPEN",
    thesis:
      "Compute scarcity persists into 2027; hyperscaler capex still front-loaded. Margins protected by Blackwell mix.",
  },
  {
    date: "2026-04-09",
    ticker: "TSM",
    direction: "LONG",
    entry: 168.4,
    current: 192.05,
    status: "OPEN",
    thesis: "Foundry pricing power on N2/N3, AI accelerator share of mix grows.",
  },
  {
    date: "2026-03-31",
    ticker: "VST",
    direction: "LONG",
    entry: 78.2,
    current: 102.7,
    status: "OPEN",
    thesis: "Independent power producer levered to AI-driven baseload demand.",
  },
  {
    date: "2026-03-14",
    ticker: "META",
    direction: "LONG",
    entry: 482.6,
    current: 519.1,
    status: "CLOSED",
    thesis: "Ads recovery + Reels monetization; trimmed on multiple re-rate.",
  },
  {
    date: "2026-02-28",
    ticker: "IWM",
    direction: "SHORT",
    entry: 218.4,
    current: 207.95,
    status: "OPEN",
    thesis: "Small-cap balance sheets stressed by floating-rate debt; hedge against book.",
  },
  {
    date: "2026-02-12",
    ticker: "URA",
    direction: "LONG",
    entry: 31.9,
    current: 36.2,
    status: "OPEN",
    thesis: "Uranium supply deficit, structural reactor newbuild cycle in Asia.",
  },
  {
    date: "2026-01-30",
    ticker: "ASML",
    direction: "LONG",
    entry: 712.3,
    current: 685.0,
    status: "CLOSED",
    thesis: "Cyclical China headwind too persistent; rotated into TSM.",
  },
  {
    date: "2026-01-15",
    ticker: "CRWD",
    direction: "LONG",
    entry: 312.8,
    current: 364.5,
    status: "OPEN",
    thesis: "Platform consolidation post-incident; enterprise renewals re-accelerating.",
  },
  {
    date: "2025-12-19",
    ticker: "XLE",
    direction: "SHORT",
    entry: 94.6,
    current: 91.2,
    status: "CLOSED",
    thesis: "Tactical hedge against energy beta in book; closed at thesis target.",
  },
  {
    date: "2025-12-04",
    ticker: "CEG",
    direction: "LONG",
    entry: 218.1,
    current: 294.8,
    status: "OPEN",
    thesis: "Nuclear PPAs with hyperscalers; cash flow visibility re-rates utility.",
  },
  {
    date: "2025-11-21",
    ticker: "AAPL",
    direction: "LONG",
    entry: 192.4,
    current: 224.6,
    status: "OPEN",
    thesis: "Services compounder; on-device AI upgrade cycle underestimated.",
  },
  {
    date: "2025-11-06",
    ticker: "ARM",
    direction: "LONG",
    entry: 124.5,
    current: 156.2,
    status: "CLOSED",
    thesis: "Royalty rate step-up post v9; closed on valuation discipline.",
  },
];

export function pctChange(p: Position): number {
  const raw =
    p.direction === "LONG"
      ? ((p.current - p.entry) / p.entry) * 100
      : ((p.entry - p.current) / p.entry) * 100;
  return raw;
}

export function aggregateStats(rows: Position[]) {
  const pnls = rows.map(pctChange);
  const wins = pnls.filter((p) => p > 0).length;
  const winRate = (wins / rows.length) * 100;
  const best = Math.max(...pnls);
  const worst = Math.min(...pnls);
  const open = rows.filter((r) => r.status === "OPEN").length;

  const holdings = rows.map((r) => {
    const start = new Date(r.date).getTime();
    const end =
      r.status === "OPEN"
        ? Date.now()
        : new Date(r.date).getTime() + 1000 * 60 * 60 * 24 * 60;
    return (end - start) / (1000 * 60 * 60 * 24);
  });
  const avgHolding = holdings.reduce((a, b) => a + b, 0) / holdings.length;

  return {
    total: rows.length,
    winRate,
    best,
    worst,
    avgHolding,
    openExposure: open,
  };
}
