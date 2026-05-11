import Link from "next/link";

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
        <nav className="hidden gap-8 sm:flex" aria-label="Primary">
          {[
            { href: "#positions", label: "Positions" },
            { href: "#method", label: "Method" },
            { href: "#access", label: "Access" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fg-muted)] transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
