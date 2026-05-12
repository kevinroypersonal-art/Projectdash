import { Card } from "@/components/ui/card";

const cards = [
  {
    tag: "01",
    title: "Factor-based",
    body: "Quality, Value and Momentum signals applied across a global equity universe.",
  },
  {
    tag: "02",
    title: "Thematic conviction",
    body: "Long-term positions on durable theses: AI infrastructure, energy, demographics.",
  },
  {
    tag: "03",
    title: "Hedged exposure",
    body: "Index and single-name hedges to cap drawdowns when conviction trades run.",
  },
];

export function Method() {
  return (
    <section
      id="method"
      aria-label="Method"
      className="relative border-t border-[color:var(--color-border)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-fg-muted)]">
          How the book is run
        </span>
        <h2 className="mt-3 font-display text-3xl tracking-display text-[color:var(--color-fg)] sm:text-4xl">
          Method
        </h2>

        <div className="mt-10 grid gap-px overflow-hidden border border-[color:var(--color-border)] bg-[color:var(--color-border)] md:grid-cols-3">
          {cards.map((c) => (
            <Card
              key={c.tag}
              className="border-0 bg-[color:var(--color-bg)] p-8"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-fg-subtle)]">
                {c.tag}
              </span>
              <h3 className="mt-4 font-display text-xl tracking-display text-[color:var(--color-fg)]">
                {c.title}
              </h3>
              <p className="mt-3 text-sm text-[color:var(--color-fg-muted)]">
                {c.body}
              </p>
              <a
                href="#access"
                className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fg-muted)] underline-offset-4 transition-colors hover:text-[color:var(--color-fg)] hover:underline"
              >
                Learn more →
              </a>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
