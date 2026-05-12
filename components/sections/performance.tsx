"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AS_OF, INCEPTION, PER_PICK_USD, daily } from "@/lib/positions";
import { cn } from "@/lib/utils";

const asOfDate = new Date(AS_OF);
const inceptionDate = new Date(INCEPTION);

const RANGES = ["1M", "3M", "6M", "YTD", "ALL"] as const;
type Range = (typeof RANGES)[number];

function startIndex(range: Range): number {
  let target: Date;
  switch (range) {
    case "1M":
      target = new Date(asOfDate);
      target.setMonth(target.getMonth() - 1);
      break;
    case "3M":
      target = new Date(asOfDate);
      target.setMonth(target.getMonth() - 3);
      break;
    case "6M":
      target = new Date(asOfDate);
      target.setMonth(target.getMonth() - 6);
      break;
    case "YTD":
      target = new Date(asOfDate.getFullYear(), 0, 1);
      break;
    case "ALL":
      target = inceptionDate;
      break;
  }
  const targetT = target.getTime();
  for (let i = 0; i < daily.dates.length; i++) {
    if (new Date(daily.dates[i]!).getTime() >= targetT) return i;
  }
  return 0;
}

const VIEW = { w: 1200, h: 360, padX: 72, padTop: 24, padBottom: 36 };

type Slice = {
  dates: string[];
  nav: number[];
  spxEq: number[];
  contrib: number[];
};

function buildSlice(range: Range): Slice {
  const i0 = startIndex(range);
  return {
    dates: daily.dates.slice(i0),
    nav: daily.nav.slice(i0),
    spxEq: daily.spxEq.slice(i0),
    contrib: daily.contrib.slice(i0),
  };
}

function buildGeometry(slice: Slice) {
  if (slice.dates.length < 2) return null;
  const all = [...slice.nav, ...slice.spxEq];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const pad = Math.max((max - min) * 0.08, max * 0.01);
  const yMin = Math.max(0, min - pad);
  const yMax = max + pad;

  const startT = new Date(slice.dates[0]!).getTime();
  const endT = new Date(slice.dates[slice.dates.length - 1]!).getTime();
  const span = endT - startT || 1;

  const innerW = VIEW.w - VIEW.padX * 2;
  const innerH = VIEW.h - VIEW.padTop - VIEW.padBottom;

  function xy(series: number[]) {
    return series.map((v, i) => {
      const t = new Date(slice.dates[i]!).getTime();
      const x = VIEW.padX + ((t - startT) / span) * innerW;
      const y =
        VIEW.padTop + innerH - ((v - yMin) / (yMax - yMin)) * innerH;
      return [x, y] as const;
    });
  }

  const navXY = xy(slice.nav);
  const spxXY = xy(slice.spxEq);

  const toPath = (pts: readonly (readonly [number, number])[]) =>
    pts
      .map(
        ([x, y], i) =>
          `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`,
      )
      .join(" ");

  const navLine = toPath(navXY);
  const spxLine = toPath(spxXY);
  const navArea = `${navLine} L ${navXY[navXY.length - 1]![0].toFixed(2)} ${(
    VIEW.padTop + innerH
  ).toFixed(2)} L ${navXY[0]![0].toFixed(2)} ${(VIEW.padTop + innerH).toFixed(
    2,
  )} Z`;

  return {
    navXY,
    spxXY,
    navLine,
    spxLine,
    navArea,
    yMin,
    yMax,
    innerW,
    innerH,
    startT,
    endT,
  };
}

function xTicks(range: Range, startT: number, endT: number, innerW: number) {
  const ticks: { x: number; label: string }[] = [];
  const span = endT - startT;
  const day = 86_400_000;
  const xFor = (t: number) =>
    VIEW.padX + ((t - startT) / (span || 1)) * innerW;

  if (range === "ALL") {
    const sy = new Date(startT).getFullYear();
    const ey = new Date(endT).getFullYear();
    for (let y = sy; y <= ey; y++) {
      const t = new Date(`${y}-01-01`).getTime();
      if (t < startT || t > endT) continue;
      ticks.push({ x: xFor(t), label: String(y) });
    }
  } else if (range === "YTD" || range === "6M") {
    const d = new Date(startT);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    while (d.getTime() <= endT) {
      ticks.push({
        x: xFor(d.getTime()),
        label: d.toLocaleString("en", { month: "short" }).toUpperCase(),
      });
      d.setMonth(d.getMonth() + 1);
    }
  } else if (range === "3M") {
    for (let t = startT + 14 * day; t <= endT; t += 14 * day) {
      const d = new Date(t);
      ticks.push({
        x: xFor(t),
        label: `${d.toLocaleString("en", { month: "short" }).toUpperCase()} ${d.getDate()}`,
      });
    }
  } else {
    for (let t = startT + 7 * day; t <= endT; t += 7 * day) {
      const d = new Date(t);
      ticks.push({
        x: xFor(t),
        label: `${d.toLocaleString("en", { month: "short" }).toUpperCase()} ${d.getDate()}`,
      });
    }
  }
  return ticks;
}

function fmtUsd(v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 10_000) return `${sign}$${(abs / 1_000).toFixed(0)}k`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

function fmtPct(v: number): string {
  const s = v >= 0 ? "+" : "";
  return `${s}${v.toFixed(2)}%`;
}

export function Performance() {
  const [range, setRange] = React.useState<Range>("ALL");
  const slice = React.useMemo(() => buildSlice(range), [range]);
  const geom = React.useMemo(() => buildGeometry(slice), [slice]);

  if (!geom) return null;

  const navEnd = slice.nav[slice.nav.length - 1]!;
  const spxEnd = slice.spxEq[slice.spxEq.length - 1]!;
  const contribEnd = slice.contrib[slice.contrib.length - 1]!;
  const multiple = contribEnd > 0 ? navEnd / contribEnd : 0;
  const vsSpxPct = spxEnd > 0 ? (navEnd / spxEnd - 1) * 100 : 0;

  let peak = slice.nav[0]!;
  let maxDD = 0;
  for (const v of slice.nav) {
    peak = Math.max(peak, v);
    if (peak > 0) {
      const dd = (v - peak) / peak;
      if (dd < maxDD) maxDD = dd;
    }
  }

  const ticks = xTicks(range, geom.startT, geom.endT, geom.innerW);

  return (
    <section
      aria-label="Performance"
      className="relative border-t border-[color:var(--color-border)]"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-fg-muted)]">
              ${PER_PICK_USD.toLocaleString()} per pick · No rebalancing · Daily MTM
            </span>
            <h2 className="mt-3 font-display text-3xl tracking-display text-white sm:text-4xl">
              Performance
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Range"
            className="flex items-center gap-1"
          >
            {RANGES.map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={range === r}
                onClick={() => setRange(r)}
                className={cn(
                  "h-8 px-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors border",
                  range === r
                    ? "border-white text-white"
                    : "border-[color:var(--color-border)] text-[color:var(--color-fg-muted)] hover:border-[color:var(--color-border-strong)] hover:text-white",
                )}
              >
                {r === "ALL" ? "All" : r}
              </button>
            ))}
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-px border border-[color:var(--color-border)] bg-[color:var(--color-border)] font-mono sm:grid-cols-4">
          <Stat label="NAV">
            <span className="text-white">{fmtUsd(navEnd)}</span>
          </Stat>
          <Stat label="Contributed">
            <span className="text-[color:var(--color-fg-muted)]">
              {fmtUsd(contribEnd)}
            </span>
          </Stat>
          <Stat label="Money multiple">
            <span className="text-white">{multiple.toFixed(2)}×</span>
          </Stat>
          <Stat label="vs SPX">
            <span className={vsSpxPct >= 0 ? "text-white" : "text-[color:var(--color-fg-subtle)]"}>
              {fmtPct(vsSpxPct)}
            </span>
          </Stat>
        </dl>

        <div className="mt-6 border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/30 p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-fg-muted)]">
            <span className="flex items-center gap-2">
              <span className="inline-block h-px w-6 bg-white" />
              The Hedge {fmtUsd(navEnd)}
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-px w-6 border-t border-dashed border-[color:var(--color-fg-subtle)]" />
              SPX-equivalent {fmtUsd(spxEnd)}
            </span>
            <span className="ml-auto text-[color:var(--color-fg-subtle)]">
              Max DD {fmtPct(maxDD * 100)}
            </span>
          </div>

          <svg
            viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
            preserveAspectRatio="none"
            className="block h-[300px] w-full sm:h-[360px]"
            role="img"
            aria-label={`Portfolio dollar NAV vs SPX-equivalent, ${range} window`}
          >
            <defs>
              <linearGradient id="navFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[0.25, 0.5, 0.75].map((f) => {
              const y =
                VIEW.padTop + (VIEW.h - VIEW.padTop - VIEW.padBottom) * f;
              return (
                <line
                  key={f}
                  x1={VIEW.padX}
                  x2={VIEW.w - VIEW.padX}
                  y1={y}
                  y2={y}
                  stroke="#1f1f1f"
                  strokeDasharray="2 4"
                />
              );
            })}

            <motion.path
              key={`area-${range}`}
              d={geom.navArea}
              fill="url(#navFill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />

            <motion.path
              key={`spx-${range}`}
              d={geom.spxLine}
              fill="none"
              stroke="#525252"
              strokeWidth="1"
              strokeDasharray="3 3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />

            <motion.path
              key={`nav-${range}`}
              d={geom.navLine}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />

            <motion.circle
              key={`navdot-${range}`}
              cx={geom.navXY[geom.navXY.length - 1]![0]}
              cy={geom.navXY[geom.navXY.length - 1]![1]}
              r="3.5"
              fill="#ffffff"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 1.2 }}
            />

            {ticks.map((t, i) => (
              <g key={`${t.label}-${i}`}>
                <line
                  x1={t.x}
                  x2={t.x}
                  y1={VIEW.h - VIEW.padBottom}
                  y2={VIEW.h - VIEW.padBottom + 4}
                  stroke="#2a2a2a"
                />
                <text
                  x={t.x}
                  y={VIEW.h - VIEW.padBottom + 18}
                  textAnchor="middle"
                  fill="#525252"
                  fontFamily="var(--font-mono)"
                  fontSize="10"
                  letterSpacing="0.18em"
                >
                  {t.label}
                </text>
              </g>
            ))}

            <text
              x={VIEW.padX - 8}
              y={VIEW.padTop + 4}
              textAnchor="end"
              fill="#525252"
              fontFamily="var(--font-mono)"
              fontSize="10"
              letterSpacing="0.18em"
            >
              {fmtUsd(geom.yMax)}
            </text>
            <text
              x={VIEW.padX - 8}
              y={VIEW.h - VIEW.padBottom}
              textAnchor="end"
              fill="#525252"
              fontFamily="var(--font-mono)"
              fontSize="10"
              letterSpacing="0.18em"
            >
              {fmtUsd(geom.yMin)}
            </text>
          </svg>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--color-border)] pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-fg-subtle)]">
            <span>
              {slice.dates[0]} → {slice.dates[slice.dates.length - 1]}
            </span>
            <span>
              Daily closes via Yahoo Finance · {daily.fallbackTickers.length > 0 ? `${daily.fallbackTickers.length} delisted ticker${daily.fallbackTickers.length === 1 ? "" : "s"} bridged` : "all tickers real"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[color:var(--color-bg)] px-4 py-3">
      <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--color-fg-subtle)]">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-base">{children}</dd>
    </div>
  );
}
