export function Manifesto() {
  return (
    <section
      aria-label="Manifesto"
      className="relative border-t border-[color:var(--color-border)]"
    >
      <div className="mx-auto max-w-3xl px-6 py-40 text-center sm:py-48">
        <p className="font-display text-2xl leading-snug tracking-display text-[color:var(--color-fg)] sm:text-3xl">
          <span className="block text-[color:var(--color-fg-muted)]">
            Hedge funds keep their positions secret.
          </span>
          <span className="block text-[color:var(--color-fg-muted)]">
            Newsletters sell promises.
          </span>
          <span className="mt-6 block text-[color:var(--color-fg)]">
            The Hedge does the opposite: every position is public, every move is
            logged.
          </span>
        </p>
      </div>
    </section>
  );
}
