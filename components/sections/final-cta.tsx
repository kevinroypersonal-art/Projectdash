import { WaitlistForm } from "@/components/site/waitlist-form";

export function FinalCta() {
  return (
    <section
      aria-label="Join the waitlist"
      className="relative border-t border-[color:var(--color-border)]"
    >
      <div className="mx-auto max-w-3xl px-6 py-28 text-center sm:px-10 sm:py-36">
        <h2 className="font-display text-4xl tracking-display text-[color:var(--color-fg)] sm:text-5xl">
          The doors are open.
        </h2>
        <p className="mt-4 text-[color:var(--color-fg-muted)] sm:text-lg">
          Join the waitlist to be notified at launch.
        </p>

        <div className="mt-10 flex justify-center">
          <WaitlistForm id="final-waitlist" submitLabel="Join waitlist" />
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fg-subtle)]">
          412 investors already inside
        </p>
      </div>
    </section>
  );
}
