"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  AS_OF,
  INCEPTION,
  equityCurve,
  positions,
  type EquityPoint,
} from "@/lib/positions";

const data: EquityPoint[] = equityCurve(positions, INCEPTION, AS_OF, 14);

const VIEW = { w: 1200, h: 360, padX: 56, padTop: 24, padBottom: 36 };

function buildGeometry(points: EquityPoint[]) {
  const min = Math.min(...points.map((p) => p.value));
  const max = Math.max(...points.map((p) => p.value));
  // Floor at 100 so the index visibly grows above the inception baseline.
  const yMin = Math.min(min, 100) - 20;
  const yMax = max + 20;

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

  // Baseline at index = 100.
  const baselineY =
    VIEW.padTop + innerH - ((100 - yMin) / (yMax - yMin)) * innerH;

  return { xy, linePath, areaPath, yMin, yMax, baselineY };
}

export function Performance() {
  const geom = React.useMemo(() => buildGeometry(data), []);
  const last = data[data.length - 1]!;
  const totalReturnPct = last.value - 100;
  const years =
    (new Date(AS_OF).getTime() - new Date(INCEPTION).getTime()) /
    (1000 * 60 * 60 * 24 * 365.25);
  const cagrPct = (Math.pow(last.value / 100, 1 / years) - 1) * 100;

  // Year ticks: Jan 1 of each year from inception to AS_OF.
  const startYear = new Date(INCEPTION).getFullYear();
  const endYear = new Date(AS_OF).getFullYear();
  const startT = new Date(data[0]!.date).getTime();
  const endT = new Date(data[data.length - 1]!.date).getTime();
  const innerW = VIEW.w - VIEW.padX * 2;
  const years_ticks: { x: number; label: string }[] = [];
  for (let y = startYear; y <= endYear; y++) {
    const t = new Date(`${y}-01-01`).getTime();
    if (t < startT || t > endT) continue;
    const x = VIEW.padX + ((t - startT) / (endT - startT)) * innerW;
    years_ticks.push({ x, label: String(y) });
  }

  // Max drawdown from running peak.
  let peak = data[0]!.value;
  let maxDD = 0;
  for (const p of data) {
    peak = Math.max(peak, p.value);
    const dd = (p.value - peak) / peak;
    if (dd < maxDD) maxDD = dd;
  }

  return (
    <section
      aria-label="Performance since inception"
      className="relative border-t border-[color:var(--color-border)]"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-fg-muted)]">
              Since inception · {INCEPTION} → {AS_OF}
            </span>
            <h2 className="mt-3 font-display text-3xl tracking-display text-white sm:text-4xl">
              Performance
            </h2>
          </div>

          <dl className="grid grid-cols-3 gap-px overflow-hidden border border-[color:var(--color-border)] bg-[color:var(--color-border)] font-mono text-sm">
            <Stat label="Index">
              <span className="text-white">{last.value.toFixed(1)}</span>
            </Stat>
            <Stat label="Total return">
              <span className="text-white">+{totalReturnPct.toFixed(1)}%</span>
            </Stat>
            <Stat label="CAGR">
              <span className="text-white">+{cagrPct.toFixed(1)}%</span>
            </Stat>
          </dl>
        </div>

        <div className="mt-10 border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/30 p-4 sm:p-6">
          <svg
            viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
            preserveAspectRatio="none"
            className="block h-[300px] w-full sm:h-[360px]"
            role="img"
            aria-label="Equity curve of the personal portfolio since inception"
          >
            <defs>
              <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineFade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Horizontal gridlines */}
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

            {/* Inception baseline */}
            <line
              x1={VIEW.padX}
              x2={VIEW.w - VIEW.padX}
              y1={geom.baselineY}
              y2={geom.baselineY}
              stroke="#2a2a2a"
              strokeDasharray="3 3"
            />
            <text
              x={VIEW.padX}
              y={geom.baselineY - 6}
              fill="#525252"
              fontFamily="var(--font-mono)"
              fontSize="10"
              letterSpacing="0.18em"
            >
              100
            </text>

            {/* Area under curve */}
            <motion.path
              d={geom.areaPath}
              fill="url(#equityFill)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            />

            {/* Line */}
            <motion.path
              d={geom.linePath}
              fill="none"
              stroke="url(#lineFade)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            />

            {/* End-of-curve marker */}
            <motion.circle
              cx={geom.xy[geom.xy.length - 1]![0]}
              cy={geom.xy[geom.xy.length - 1]![1]}
              r="3.5"
              fill="#ffffff"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 1.6 }}
            />

            {/* Year ticks */}
            {years_ticks.map((t) => (
              <g key={t.label}>
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

            {/* Y-axis bounds */}
            <text
              x={VIEW.padX - 8}
              y={VIEW.padTop + 4}
              textAnchor="end"
              fill="#525252"
              fontFamily="var(--font-mono)"
              fontSize="10"
              letterSpacing="0.18em"
            >
              {geom.yMax.toFixed(0)}
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
              {geom.yMin.toFixed(0)}
            </text>
          </svg>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--color-border)] pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-fg-subtle)]">
            <span>
              Equal-weighted index · base 100 on {INCEPTION}
            </span>
            <span>Max drawdown {(maxDD * 100).toFixed(1)}%</span>
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
