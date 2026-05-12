export type Direction = "LONG" | "SHORT";
export type Status = "OPEN" | "CLOSED";

export type Position = {
  date: string; // YYYY-MM-DD — pick date
  closeDate?: string; // YYYY-MM-DD — only for CLOSED
  ticker: string;
  direction: Direction;
  entry: number;
  current: number; // mark-to-market for OPEN; sell price for CLOSED
  status: Status;
  thesis?: string;
  isWinner?: boolean;
};

export const INCEPTION = "2022-07-01";
export const AS_OF = "2026-05-11";

function open(
  date: string,
  ticker: string,
  entry: number,
  ret: number,
  opts: { isWinner?: boolean } = {},
): Position {
  return {
    date,
    ticker,
    direction: "LONG",
    entry,
    current: round(entry * (1 + ret / 100)),
    status: "OPEN",
    isWinner: opts.isWinner,
  };
}

function closed(
  date: string,
  closeDate: string,
  ticker: string,
  entry: number,
  exit: number,
  opts: { isWinner?: boolean } = {},
): Position {
  return {
    date,
    closeDate,
    ticker,
    direction: "LONG",
    entry,
    current: exit,
    status: "CLOSED",
    isWinner: opts.isWinner,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

// Sorted most-recent pick first.
export const positions: Position[] = [
  open("2026-05-01", "CRDO", 180.02, 14.31),
  open("2026-04-15", "NEXA", 13.8, -3.84),
  open("2026-04-01", "CSTM", 26.93, 26.44),
  open("2026-03-16", "LITE", 645.44, 63.82),
  open("2026-03-02", "FN", 569.3, 16.21),
  open("2026-02-17", "GM", 80.72, -6.25),
  open("2026-02-02", "DY", 381.79, 13.03),
  open("2026-01-15", "NEM", 113.89, 5.46),
  open("2026-01-02", "B", 43.57, 7.25),
  open("2025-12-15", "TIGO", 53.58, 46.83),
  open("2025-12-01", "W", 111.57, -43.34),
  open("2025-11-17", "PARR", 45.85, 40.89),
  open("2025-11-03", "INCY", 97.94, 2.88),
  open("2025-10-15", "MU", 190.76, 320.56),
  open("2025-10-01", "TTMI", 58.99, 180.08),
  open("2025-09-15", "CDE", 16.5, 17.88),
  open("2025-09-02", "KGC", 21.3, 49.2),
  open("2025-08-15", "VISN", 15.39, -22.74),
  open("2025-08-01", "STRL", 260.34, 227.61),
  closed("2025-07-15", "2025-11-13", "DXPE", 97.18, 88.5),
  closed("2025-07-01", "2026-04-27", "WLDN", 65.8, 68.74),
  open("2025-06-16", "SSRM", 12.91, 163.83),
  closed("2025-06-02", "2025-11-04", "LRN", 156.11, 71.15),
  open("2025-05-15", "UNFI", 30.15, 74.0),
  open("2025-05-01", "MFC", 30.83, 29.91),
  open("2025-04-15", "EAT", 151.77, -8.13),
  open("2025-04-01", "EZPW", 15.46, 125.23),
  open("2025-03-17", "ARQT", 16.53, 27.28),
  closed("2025-03-03", "2026-02-03", "WFC", 77.88, 93.03),
  closed("2025-02-18", "2025-08-28", "ITRN", 40.6, 34.56),
  open("2025-02-03", "CRDO", 68.94, 198.48),
  closed("2025-01-15", "2026-01-26", "PYPL", 89.69, 56.71),
  open("2025-01-02", "ALL", 191.67, 11.66),
  closed("2024-12-16", "2026-02-02", "LC", 17.67, 17.12),
  closed("2024-12-02", "2025-11-06", "QTWO", 106.2, 69.31),
  open("2024-11-15", "CLS", 81.18, 376.1),
  open("2024-11-01", "CCL", 21.94, 14.06),
  open("2024-10-15", "AGX", 118.69, 472.76, { isWinner: true }),
  closed("2024-10-15", "2026-01-20", "AGX", 118.69, 384.16, { isWinner: true }),
  open("2024-10-01", "POWL", 75.02, 326.5, { isWinner: true }),
  closed("2024-10-01", "2026-03-11", "POWL", 75.02, 174.34, { isWinner: true }),
  closed("2024-09-16", "2026-04-01", "PPC", 41.02, 37.84),
  open("2024-09-03", "SYF", 49.4, 43.67),
  closed("2024-08-15", "2025-05-08", "ZETA", 24.29, 13.3),
  closed("2024-08-01", "2025-05-05", "RGA", 223.86, 197.39),
  open("2024-07-15", "CVSA", 76.91, 69.34),
  open("2024-07-01", "BRK.B", 408.09, 17.26),
  closed("2024-06-17", "2025-11-06", "SFM", 78.97, 78.01, { isWinner: true }),
  closed("2024-06-17", "2025-02-18", "SFM", 78.97, 172.41, { isWinner: true }),
  open("2024-06-03", "SKYW", 80.01, 7.71),
  open("2024-05-15", "BLBD", 52.83, 33.33),
  closed("2024-05-01", "2025-08-25", "GM", 44.5, 58.22),
  closed("2024-04-15", "2024-09-12", "GCT", 33.36, 17.63),
  open("2024-04-01", "EAT", 51.25, 172.06),
  open("2024-03-15", "RCL", 128.75, 104.27, { isWinner: true }),
  closed("2024-03-15", "2025-10-29", "RCL", 128.75, 285.0, { isWinner: true }),
  closed("2024-03-01", "2024-11-19", "CAH", 114.45, 118.87),
  open("2024-02-15", "OKTA", 89.36, -8.3),
  open("2024-02-01", "TWLO", 71.78, 175.53),
  closed("2024-01-16", "2025-08-04", "PEP", 167.27, 139.6),
  closed("2024-01-02", "2025-02-14", "MOD", 59.77, 92.33),
  closed("2023-12-15", "2025-02-04", "MHO", 123.72, 121.25),
  closed("2023-12-01", "2024-12-30", "CMCSA", 42.25, 37.4),
  open("2023-11-15", "APP", 42.44, 990.83),
  closed("2023-11-15", "2025-10-01", "APP", 42.44, 709.33),
  open("2023-11-01", "MFC", 17.6, 127.56),
  open("2023-10-16", "CLS", 27.3, 1315.75),
  closed("2023-10-16", "2025-10-31", "CLS", 27.3, 345.78),
  closed("2023-10-02", "2025-03-20", "ANF", 56.95, 83.06),
  open("2023-09-15", "TMUS", 143.97, 33.25),
  closed("2023-09-01", "2025-05-14", "GOOGL", 137.46, 164.2),
  closed("2023-08-15", "2024-08-20", "META", 306.14, 528.0),
  open("2023-08-01", "STRL", 62.43, 1266.17),
  closed("2023-07-17", "2025-10-27", "GRBK", 57.24, 67.8),
  closed("2023-07-03", "2025-03-06", "AMPH", 58.75, 28.01),
  closed("2023-06-15", "2025-05-12", "CRM", 207.95, 287.0),
  open("2023-06-01", "UBER", 37.5, 102.85),
  open("2023-05-15", "POWL", 18.22, 1656.3, { isWinner: true }),
  closed("2023-05-15", "2026-03-11", "POWL", 18.22, 174.34, { isWinner: true }),
  open("2023-05-01", "CAAP", 11.31, 123.3, { isWinner: true }),
  closed("2023-05-01", "2025-12-17", "CAAP", 11.31, 25.24, { isWinner: true }),
  closed("2023-04-17", "2024-02-16", "ACLS", 125.69, 116.78),
  closed("2023-04-03", "2024-02-05", "TGLS", 43.26, 46.83),
  closed("2023-03-15", "2024-02-09", "PERI", 34.3, 23.89),
  closed("2023-03-01", "2024-11-08", "ASC", 18.7, 12.25),
  closed("2023-02-15", "2025-06-09", "URI", 451.78, 709.55),
  closed("2023-02-01", "2024-01-16", "JXN", 45.01, 48.65),
  closed("2023-01-16", "2024-12-18", "TEX", 48.12, 46.73),
  closed("2023-01-03", "2024-07-29", "MPC", 115.65, 171.96),
  closed("2022-12-15", "2025-02-14", "MOD", 20.59, 92.33),
  closed("2022-12-01", "2024-08-06", "DINO", 63.04, 46.41),
  closed("2022-11-15", "2024-10-30", "SMCI", 8.53, 34.22),
  closed("2022-11-15", "2024-03-19", "SMCI", 8.53, 91.1),
  closed("2022-11-01", "2023-08-07", "HLIT", 15.6, 10.64),
  closed("2022-10-17", "2024-01-26", "XOM", 101.07, 103.0),
  closed("2022-10-03", "2025-02-04", "MHO", 36.92, 121.25),
  closed("2022-09-15", "2023-05-25", "LTHM", 14.38, 9.81),
  closed("2022-09-01", "2023-05-12", "CVX", 156.48, 156.62),
  closed("2022-08-15", "2023-02-16", "TA", 53.82, 84.43),
  closed("2022-08-01", "2023-10-23", "SU", 33.44, 33.51),
  closed("2022-07-15", "2024-07-01", "BXC", 73.09, 89.18),
  closed("2022-07-01", "2023-07-24", "NUE", 104.24, 166.65),
  closed("2022-07-01", "2024-07-15", "VLO", 107.79, 148.75),
  closed("2022-07-01", "2024-08-26", "ARCH", 143.09, 124.19),
  closed("2022-07-01", "2023-08-01", "COP", 91.93, 117.38),
  closed("2022-07-01", "2024-09-12", "AMR", 127.13, 202.79),
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
        ? new Date(AS_OF).getTime()
        : new Date(r.closeDate ?? AS_OF).getTime();
    return Math.max(0, (end - start) / (1000 * 60 * 60 * 24));
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

export type EquityPoint = { date: string; value: number };

export const PER_PICK_USD = 1000;

// Daily NAV / SPX-equivalent / contributions are precomputed at build time
// from real Yahoo Finance closes. See scripts/build-data.mjs and
// data/daily.json. The script applies the $1,000-per-pick / fixed-share rule
// against actual daily prices for every ticker we can resolve.
import dailyJson from "@/data/daily.json";

export const daily = {
  dates: dailyJson.dates as string[],
  nav: dailyJson.nav as number[],
  spxEq: dailyJson.spxEq as number[],
  contrib: dailyJson.contrib as number[],
  fallbackTickers: dailyJson.fallbackTickers as string[],
};



