import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./theme-toggle";

export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
        <Link
          href="/"
          className="font-mono text-sm tracking-logo text-[color:var(--color-fg)]"
          aria-label="The Hedge — home"
        >
          THE HEDGE
        </Link>
        <nav
          className="flex items-center gap-6 sm:gap-8"
          aria-label="Primary"
        >
          <a
            href="#positions"
            className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fg-muted)] transition-colors hover:text-[color:var(--color-fg)] sm:inline"
          >
            Positions
          </a>
          <a
            href="#method"
            className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fg-muted)] transition-colors hover:text-[color:var(--color-fg)] sm:inline"
          >
            Method
          </a>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fg-muted)] transition-colors hover:text-[color:var(--color-fg)]"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-8 items-center border border-[color:var(--color-border-strong)] px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-fg)] transition-colors hover:border-[color:var(--color-fg)]"
            >
              Get access
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="#positions"
              className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fg-muted)] transition-colors hover:text-[color:var(--color-fg)] sm:inline"
            >
              Analysis
            </Link>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-8 w-8",
                },
              }}
            />
          </Show>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
