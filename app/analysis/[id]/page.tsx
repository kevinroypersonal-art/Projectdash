import { notFound } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import {
  findPositionById,
  pctChange,
  positions,
  positionId,
} from "@/lib/positions";
import { Badge } from "@/components/ui/badge";
import { formatPct, formatPrice } from "@/lib/utils";

export const dynamicParams = true;

export function generateStaticParams() {
  return positions.map((p) => ({ id: positionId(p) }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = findPositionById(id);
  if (!p) notFound();

  const pnl = pctChange(p);
  const holdDays = Math.max(
    1,
    Math.round(
      (new Date(p.closeDate ?? new Date().toISOString().slice(0, 10)).getTime() -
        new Date(p.date).getTime()) /
        86_400_000,
    ),
  );

  return (
    <main className="relative mx-auto min-h-screen max-w-4xl px-6 py-32 sm:px-10">
      <Link
        href="/#positions"
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fg-muted)] transition-colors hover:text-[color:var(--color-fg)]"
      >
        ← All positions
      </Link>

      <header className="mt-10 flex flex-col gap-2 border-b border-[color:var(--color-border)] pb-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-fg-muted)]">
            {p.date} {p.closeDate ? `→ ${p.closeDate}` : "· Open"}
          </span>
          {p.isWinner ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-fg)]">
              Winner
            </span>
          ) : null}
        </div>
        <h1 className="font-mono text-5xl tracking-display text-[color:var(--color-fg)]">
          {p.ticker}
        </h1>
        <div className="mt-2 flex items-center gap-3 font-mono text-sm">
          <Badge variant="muted">{p.direction}</Badge>
          <Badge variant={p.status === "OPEN" ? "outline" : "muted"}>
            {p.status}
          </Badge>
          <span
            className={
              pnl >= 0
                ? "text-[color:var(--color-fg)]"
                : "text-[color:var(--color-fg-subtle)]"
            }
          >
            {formatPct(pnl)}
          </span>
        </div>
      </header>

      <dl className="mt-10 grid grid-cols-2 gap-px border border-[color:var(--color-border)] bg-[color:var(--color-border)] font-mono sm:grid-cols-4">
        <Stat label="Entry">
          <span className="text-[color:var(--color-fg)]">${formatPrice(p.entry)}</span>
        </Stat>
        <Stat label={p.status === "OPEN" ? "Current" : "Exit"}>
          <span className="text-[color:var(--color-fg)]">${formatPrice(p.current)}</span>
        </Stat>
        <Stat label="Holding">
          <span className="text-[color:var(--color-fg)]">{holdDays}d</span>
        </Stat>
        <Stat label="Return">
          <span
            className={
              pnl >= 0
                ? "text-[color:var(--color-fg)]"
                : "text-[color:var(--color-fg-subtle)]"
            }
          >
            {formatPct(pnl)}
          </span>
        </Stat>
      </dl>

      <section className="mt-12 space-y-6">
        <header className="flex items-baseline justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-[color:var(--color-fg-muted)]">
            Analysis
          </h2>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-fg-subtle)]">
            <Lock className="h-3 w-3" /> Member-only
          </span>
        </header>

        <article className="space-y-5 text-[color:var(--color-fg)]">
          <p>
            {p.thesis ??
              `Full thesis on ${p.ticker} is being migrated from the research vault. ` +
                "This page will populate with the original write-up, position sizing rationale, catalyst calendar and current monitoring notes."}
          </p>
          <p className="text-[color:var(--color-fg-muted)]">
            For now, the public log captures the entry on{" "}
            <span className="font-mono">{p.date}</span> at{" "}
            <span className="font-mono">${formatPrice(p.entry)}</span>
            {p.status === "CLOSED" && p.closeDate ? (
              <>
                {" "}
                and exit on{" "}
                <span className="font-mono">{p.closeDate}</span> at{" "}
                <span className="font-mono">${formatPrice(p.current)}</span>
              </>
            ) : (
              <>
                {" "}
                and the position remains open, marked at{" "}
                <span className="font-mono">${formatPrice(p.current)}</span>
              </>
            )}
            .
          </p>
        </article>

        <div className="space-y-3 border border-[color:var(--color-border)] p-6">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-fg-muted)]">
            What members get
          </h3>
          <ul className="space-y-2 text-sm text-[color:var(--color-fg-muted)]">
            <li>· Full investment thesis and sizing rationale</li>
            <li>· Catalyst calendar and earnings expectations</li>
            <li>· Risk factors and stop-loss thinking</li>
            <li>· Real-time alerts on adds, trims, and exits</li>
          </ul>
        </div>
      </section>
    </main>
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
      <dd className="mt-1 font-mono text-lg">{children}</dd>
    </div>
  );
}
