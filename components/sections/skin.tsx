export function Skin() {
  return (
    <section
      aria-label="Skin in the game"
      className="relative border-t border-[color:var(--color-border)]"
    >
      <div className="mx-auto max-w-5xl px-6 py-24 sm:px-10">
        <div className="border border-[color:var(--color-border-strong)] p-10 sm:p-16">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-fg-muted)]">
            Skin in the game
          </span>
          <p className="mt-6 font-display text-2xl leading-snug tracking-display text-[color:var(--color-fg)] sm:text-3xl">
            Every position published is a real position, taken with my own
            capital. No paper portfolio, no simulation. You see exactly what I
            hold, in real time.
          </p>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-fg-muted)]">
            — Kevin, founder
          </p>
        </div>
      </div>
    </section>
  );
}
