import { Check, Lock } from "lucide-react";

const publicItems = [
  "All positions, entries & exits",
  "Aggregated historical performance",
  "General methodology",
];

const memberItems = [
  "Full thesis behind each position",
  "Real-time alerts on every trade",
  "Weekly portfolio review notes",
  "Private community access",
  "Monthly Q&A with the founder",
];

export function Comparison() {
  return (
    <section
      aria-label="Public vs Members"
      className="relative border-t border-[color:var(--color-border)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-fg-muted)]">
          What you get
        </span>
        <h2 className="mt-3 font-display text-3xl tracking-display text-white sm:text-4xl">
          Public vs Members
        </h2>

        <div className="mt-10 grid gap-px overflow-hidden border border-[color:var(--color-border)] bg-[color:var(--color-border)] md:grid-cols-2">
          <Column
            label="Public"
            sub="Free, always"
            items={publicItems}
            icon={<Check className="h-3.5 w-3.5" />}
          />
          <Column
            label="Members"
            sub="By subscription"
            items={memberItems}
            icon={<Lock className="h-3.5 w-3.5" />}
            highlighted
          />
        </div>
      </div>
    </section>
  );
}

function Column({
  label,
  sub,
  items,
  icon,
  highlighted,
}: {
  label: string;
  sub: string;
  items: string[];
  icon: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div className="bg-[color:var(--color-bg)] p-8">
      <div className="flex items-baseline justify-between">
        <h3
          className={`font-mono text-xs uppercase tracking-[0.22em] ${
            highlighted ? "text-white" : "text-[color:var(--color-fg-muted)]"
          }`}
        >
          {label}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-fg-subtle)]">
          {sub}
        </span>
      </div>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm text-[color:var(--color-fg)]"
          >
            <span
              className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center border ${
                highlighted
                  ? "border-white text-white"
                  : "border-[color:var(--color-border-strong)] text-[color:var(--color-fg-muted)]"
              }`}
            >
              {icon}
            </span>
            <span className="text-[color:var(--color-fg-muted)]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
