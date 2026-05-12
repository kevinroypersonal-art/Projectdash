import { Nav } from "@/components/site/nav";
import { Meteors } from "@/components/effects/meteors";
import { GridPattern } from "@/components/effects/grid-pattern";
import { Spotlight } from "@/components/effects/spotlight";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { Ticker } from "@/components/site/ticker";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-screen flex-col overflow-hidden">
      <GridPattern />
      <Spotlight />
      <Meteors count={22} />

      <Nav />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-start justify-center px-6 pt-32 sm:px-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-fg-muted)]">
          A personal hedge · Live since 2025
        </span>

        <h1 className="mt-6 max-w-3xl text-balance font-display text-4xl tracking-display sm:text-6xl lg:text-7xl">
          <span className="text-[color:var(--color-fg-muted)]">
            Most hedge funds hide their plays.
          </span>
          <br />
          <span className="text-[color:var(--color-fg)]">The Hedge shows them.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base text-[color:var(--color-fg-muted)] sm:text-lg">
          A personal portfolio. Run with conviction. Documented in public.
        </p>

        <div id="access" className="mt-10 w-full">
          <WaitlistForm id="hero-waitlist" />
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fg-subtle)]">
            Limited access. No spam, ever.
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-auto">
        <Ticker />
      </div>
    </section>
  );
}
