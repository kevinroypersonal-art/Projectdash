"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CountUp } from "@/components/site/count-up";
import {
  positions,
  pctChange,
  aggregateStats,
  positionId,
} from "@/lib/positions";
import { formatPct, formatPrice, cn } from "@/lib/utils";

type Filter = "all" | "open" | "closed";

const PAGE_SIZE = 10;

export function Positions() {
  const [filter, setFilter] = React.useState<Filter>("all");
  const [page, setPage] = React.useState(1);

  const rows = React.useMemo(() => {
    if (filter === "open") return positions.filter((p) => p.status === "OPEN");
    if (filter === "closed")
      return positions.filter((p) => p.status === "CLOSED");
    return positions;
  }, [filter]);

  // Reset to the first page whenever the filter changes.
  React.useEffect(() => {
    setPage(1);
  }, [filter]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageRows = rows.slice(pageStart, pageStart + PAGE_SIZE);

  const stats = React.useMemo(() => aggregateStats(positions), []);

  return (
    <section
      id="positions"
      aria-label="Live positions"
      className="relative border-t border-[color:var(--color-border)]"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-fg-muted)]">
              Live · Updated continuously
            </span>
            <h2 className="mt-3 font-display text-3xl tracking-display text-white sm:text-4xl">
              Positions
            </h2>
          </div>
          <div
            role="tablist"
            aria-label="Filter positions"
            className="flex items-center gap-2"
          >
            {(
              [
                { id: "all", label: "All" },
                { id: "open", label: "Open" },
                { id: "closed", label: "Closed" },
              ] as { id: Filter; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={filter === tab.id}
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "h-8 px-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
                  "border",
                  filter === tab.id
                    ? "border-white text-white"
                    : "border-[color:var(--color-border)] text-[color:var(--color-fg-muted)] hover:border-[color:var(--color-border-strong)] hover:text-white",
                )}
              >
                {tab.label}
              </button>
            ))}
            <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-fg-subtle)]">
              {rows.length} / {positions.length}
            </span>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto border border-[color:var(--color-border)] bg-black/30">
          <table className="min-w-[920px] w-full text-left font-mono text-sm">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-fg-subtle)]">
                <Th>Date</Th>
                <Th>Ticker</Th>
                <Th>Direction</Th>
                <Th className="text-right">Entry</Th>
                <Th className="text-right">Current / Exit</Th>
                <Th className="text-right">P&amp;L</Th>
                <Th>Status</Th>
                <Th>Thesis</Th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((p, i) => {
                const pnl = pctChange(p);
                const delay = Math.min(i, 9) * 0.04;
                const href = `/analysis/${positionId(p)}`;
                return (
                  <motion.tr
                    key={`${p.ticker}-${p.date}-${p.closeDate ?? "open"}-${pageStart + i}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay }}
                    className="group cursor-pointer border-b border-[color:var(--color-border)] transition-colors hover:bg-[color:var(--color-surface)]"
                    onClick={(e) => {
                      // Don't fight nested links / interactive children.
                      const target = e.target as HTMLElement;
                      if (target.closest("a, button")) return;
                      window.location.href = href;
                    }}
                  >
                    <Td className="text-[color:var(--color-fg-subtle)]">
                      {p.date}
                    </Td>
                    <Td>
                      <span className="text-white">{p.ticker}</span>
                      {p.isWinner ? (
                        <span className="ml-2 align-middle font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--color-fg-muted)]">
                          Winner
                        </span>
                      ) : null}
                    </Td>
                    <Td>
                      <Badge variant="muted">{p.direction}</Badge>
                    </Td>
                    <Td className="text-right text-[color:var(--color-fg-muted)]">
                      {formatPrice(p.entry)}
                    </Td>
                    <Td className="text-right text-[color:var(--color-fg-muted)]">
                      <div>{formatPrice(p.current)}</div>
                      {p.status === "CLOSED" && p.closeDate ? (
                        <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-fg-subtle)]">
                          {p.closeDate}
                        </div>
                      ) : null}
                    </Td>
                    <Td
                      className={cn(
                        "text-right",
                        pnl >= 0
                          ? "text-white"
                          : "text-[color:var(--color-fg-subtle)]",
                      )}
                    >
                      {formatPct(pnl)}
                    </Td>
                    <Td>
                      <Badge
                        variant={p.status === "OPEN" ? "outline" : "muted"}
                      >
                        {p.status}
                      </Badge>
                    </Td>
                    <Td className="max-w-[280px]">
                      <Link
                        href={href}
                        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-fg-muted)] transition-colors hover:text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Lock className="h-3 w-3" /> View analysis
                        <ChevronRight className="h-3 w-3 -ml-0.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </Td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={setPage}
          total={rows.length}
          pageStart={pageStart}
          pageEnd={Math.min(pageStart + PAGE_SIZE, rows.length)}
        />

        <dl className="mt-8 grid grid-cols-2 gap-px border border-[color:var(--color-border)] bg-[color:var(--color-border)] sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Total positions">
            <CountUp to={stats.total} />
          </Stat>
          <Stat label="Win rate">
            <CountUp to={stats.winRate} decimals={1} suffix="%" />
          </Stat>
          <Stat label="Best trade">
            <CountUp to={stats.best} decimals={1} prefix="+" suffix="%" />
          </Stat>
          <Stat label="Worst trade">
            <CountUp to={stats.worst} decimals={1} suffix="%" />
          </Stat>
          <Stat label="Avg holding">
            <CountUp to={stats.avgHolding} decimals={0} suffix="d" />
          </Stat>
          <Stat label="Open exposure">
            <CountUp to={stats.openExposure} />
          </Stat>
        </dl>

        <p className="mt-6 max-w-2xl text-sm text-[color:var(--color-fg-muted)]">
          Positions and P&amp;L are 100% public. Full thesis and real-time
          alerts are reserved for members.
        </p>

        <div className="mt-6">
          <a
            href="#access"
            className="inline-flex h-8 items-center px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-fg-muted)] transition-colors hover:text-white"
          >
            Unlock theses · Request access →
          </a>
        </div>
      </div>
    </section>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("px-4 py-3 font-normal", className)}>{children}</th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-4 py-3 align-top", className)}>{children}</td>;
}

function Pagination({
  page,
  totalPages,
  onChange,
  total,
  pageStart,
  pageEnd,
}: {
  page: number;
  totalPages: number;
  onChange: (n: number) => void;
  total: number;
  pageStart: number;
  pageEnd: number;
}) {
  const pageNumbers = buildPageRange(page, totalPages);
  const btnBase =
    "h-8 min-w-[2rem] px-2 inline-flex items-center justify-center border font-mono text-[11px] uppercase tracking-[0.16em] transition-colors";
  const inactive =
    "border-[color:var(--color-border)] text-[color:var(--color-fg-muted)] hover:border-[color:var(--color-border-strong)] hover:text-white";
  const active = "border-white text-white";
  const disabled = "opacity-30 cursor-not-allowed hover:border-[color:var(--color-border)] hover:text-[color:var(--color-fg-muted)]";

  return (
    <nav
      aria-label="Positions pagination"
      className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-fg-muted)]"
    >
      <span className="text-[color:var(--color-fg-subtle)]">
        {total === 0 ? 0 : pageStart + 1}–{pageEnd} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          aria-label="Previous page"
          className={cn(btnBase, inactive, page <= 1 && disabled)}
        >
          ←
        </button>
        {pageNumbers.map((n, i) =>
          n === "…" ? (
            <span
              key={`gap-${i}`}
              className="px-2 text-[color:var(--color-fg-subtle)]"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              aria-current={n === page ? "page" : undefined}
              onClick={() => onChange(n)}
              className={cn(btnBase, n === page ? active : inactive)}
            >
              {n}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          aria-label="Next page"
          className={cn(btnBase, inactive, page >= totalPages && disabled)}
        >
          →
        </button>
      </div>
    </nav>
  );
}

function buildPageRange(page: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const out: (number | "…")[] = [1];
  const left = Math.max(2, page - 1);
  const right = Math.min(total - 1, page + 1);
  if (left > 2) out.push("…");
  for (let i = left; i <= right; i++) out.push(i);
  if (right < total - 1) out.push("…");
  out.push(total);
  return out;
}

function Stat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[color:var(--color-bg)] p-5">
      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-fg-subtle)]">
        {label}
      </dt>
      <dd className="mt-2 font-mono text-2xl text-white">{children}</dd>
    </div>
  );
}
