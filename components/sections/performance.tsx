"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AS_OF,
  INCEPTION,
  navCurve,
  positions,
  type EquityPoint,
} from "@/lib/positions";
import { cn } from "@/lib/utils";

const fullCurve: EquityPoint[] = navCurve(positions, INCEPTION, AS_OF);
const asOfDate = new Date(AS_OF);
const inceptionDate = new Date(INCEPTION);

const RANGES = ["1M", "3M", "6M", "YTD", "ALL"] as const;
type Range = (typeof RANGES)[number];

function rangeStart(range: Range): Date {
  switch (range) {
    case "1M": {
      const d = new Date(asOfDate);
      d.setMonth(d.getMonth() - 1);
      return d;
    }
    case "3M": {
      const d = new Date(asOfDate);
      d.setMonth(d.getMonth() - 3);
      return d;
    }
    case "6M": {
      const d = new Date(asOfDate);
      d.setMonth(d.getMonth() - 6);
      return d;
    }
    case "YTD":
      return new Date(asOfDate.getFullYear(), 0, 1);
    case "ALL":
      return inceptionDate;
  }
}

function sliceCurve(range: Range): EquityPoint[] {
  const start = rangeStart(range).getTime();
  return fullCurve.filter((p) => new Date(p.date).getTime() >= start);
}

const VIEW = { w: 1200, h: 360, padX: 56, padTop: 24, padBottom: 36 };

function buildGeometry(points: EquityPoint[]) {
  if (points.length < 2) {
    return null;
  }
  const min = Math.min(...points.map((p) => p.value));
  const max = Math.max(...points.map((p) => p.value));
  const pad = Math.max((max - min) * 0.08, max * 0.005);
  const yMin = min - pad;
  const yMax = max + pad;

  const startT = new Date(points[0]!.date).getTime();
  const endT = new Date(points[points.length - 1]!.date).getTime();
  const span = endT - startT || 1;

  const innerW = VIEW.w - VIEW.padX * 2;
  const innerH = VIEW.h - VIEW.padTop - VIEW.padBottom;

  const xy = points.map((p) => {
    const t = new Date(p.date).getTime();
    const x = VIEW.padX + ((t - startT) / span) * innerW;
    const y =
      VIEW.padTop + innerH - ((p.value - yMin) / (yMax - yMin)) * innerH;
    return [x, y] as const;
  });

  const linePath = xy
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L ${xy[xy.length - 1]![0].toFixed(2)} ${(
    VIEW.padTop + innerH
  ).toFixed(2)} L ${xy[0]![0].toFixed(2)} ${(VIEW.padTop + innerH).toFixed(
    2,
  )} Z`;

  return { xy, linePath, areaPath, yMin, yMax, innerW, innerH, startT, endT };
}

function xTicks(range: Range, startT: number, endT: number, innerW: number) {
  const ticks: { x: number; label: string }[] = [];
  const span = endT - startT;
  const day = 86_400_000;
  const xFor = (t: number) =>
    VIEW.padX + ((t - startT) / (span || 1)) * innerW;

  if (range === "ALL") {
    const startYear = new Date(startT).getFullYear();
    const endYear = new Date(endT).getFullYear();
    for (let y = startYear; y <= endYear; y++) {
      const t = new Date(`${y}-01-01`).getTime();
      if (t < startT || t > endT) continue;
      ticks.push({ x: xFor(t), label: String(y) });
    }
  } else if (range === "YTD" || range === "6M") {
    // Monthly ticks
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
    // Every two weeks
    for (let t = startT + 14 * day; t <= endT; t += 14 * day) {
      const d = new Date(t);
      ticks.push({
        x: xFor(t),
        label: `${d.toLocaleString("en", { month: "short" }).toUpperCase()} ${d.getDate()}`,
      });
    }
  } else {
    // 1M — weekly
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

function fmtIndex(v: number): string {
  if (v >= 1000) return v.toFixed(0);
  if (v >= 100) return v.toFixed(1);
  return v.toFixed(2);
}

function fmtPct(v: number): string {
  const s = v >= 0 ? "+" : "";
  return `${s}${v.toFixed(2)}%`;
}

export function Performance() {
  const [range, setRange] = React.useState<Range>("ALL");
  const data = React.useMemo(() => sliceCurve(range), [range]);
  const geom = React.useMemo(() => buildGeometry(data), [data]);

  if (!geom || data.length === 0) return null;

  const first = data[0]!;
  const last = data[data.length - 1]!;
  const periodReturn = (last.value / first.value - 1) * 100;
  const totalReturn = (last.value / 100 - 1) * 100;
  const years =
    (new Date(last.date).getTime() - new Date(first.date).getTime()) /
    (1000 * 60 * 60 * 24 * 365.25);
  const cagr =
    years >= 1 ? (Math.pow(last.value / first.value, 1 / years) - 1) * 100 : null;

  let peak = first.value;
  let maxDD = 0;
  for (const p of data) {
    peak = Math.max(peak, p.value);
    const dd = (p.value - peak) / peak;
    if (dd < maxDD) maxDD = dd;
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
              Daily NAV · base 100 on {INCEPTION}
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
            <span className="text-white">{fmtIndex(last.value)}</span>
          </Stat>
          <Stat label={`${range === "ALL" ? "Since inception" : range} return`}>
            <span className={periodReturn >= 0 ? "text-white" : "text-[color:var(--color-fg-subtle)]"}>
              {fmtPct(periodReturn)}
            </span>
          </Stat>
          <Stat label="CAGR">
            <span className="text-white">{cagr !== null ? fmtPct(cagr) : "—"}</span>
          </Stat>
          <Stat label="Max drawdown">
            <span className="text-[color:var(--color-fg-subtle)]">
              {fmtPct(maxDD * 100)}
            </span>
          </Stat>
        </dl>

        <div className="mt-6 border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/30 p-4 sm:p-6">
          <svg
            viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
            preserveAspectRatio="none"
            className="block h-[300px] w-full sm:h-[360px]"
            role="img"
            aria-label={`NAV curve, ${range} window`}
          >
            <defs>
              <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineFade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
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
              d={geom.areaPath}
              fill="url(#equityFill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />

            <motion.path
              key={`line-${range}`}
              d={geom.linePath}
              fill="none"
              stroke="url(#lineFade)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />

            <motion.circle
              key={`dot-${range}`}
              cx={geom.xy[geom.xy.length - 1]![0]}
              cy={geom.xy[geom.xy.length - 1]![1]}
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
              {fmtIndex(geom.yMax)}
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
              {fmtIndex(geom.yMin)}
            </text>
          </svg>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--color-border)] pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-fg-subtle)]">
            <span>
              {first.date} → {last.date}
            </span>
            <span>
              Total return since inception {fmtPct(totalReturn)}
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
