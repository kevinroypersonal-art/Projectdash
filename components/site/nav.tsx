import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
        <Link
          href="/"
          className="font-mono text-sm tracking-logo text-white"
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
            className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fg-muted)] transition-colors hover:text-white sm:inline"
          >
            Positions
          </a>
          <a
            href="#method"
            className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fg-muted)] transition-colors hover:text-white sm:inline"
          >
            Method
          </a>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fg-muted)] transition-colors hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-8 items-center border border-[color:var(--color-border-strong)] px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-colors hover:border-white"
            >
              Get access
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="#positions"
              className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fg-muted)] transition-colors hover:text-white sm:inline"
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
        </nav>
      </div>
    </header>
  );
}
