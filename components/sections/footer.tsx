export function Footer() {
  const links = [
    { href: "#", label: "Transparency" },
    { href: "#method", label: "Method" },
    { href: "#", label: "Terms" },
    { href: "#", label: "Contact" },
  ];

  return (
    <footer className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl space-y-4 text-xs leading-relaxed text-[color:var(--color-fg-muted)]">
            <p className="font-mono text-sm tracking-logo text-[color:var(--color-fg)]">
              THE HEDGE
            </p>
            <p>
              The Hedge est édité par <strong className="text-[color:var(--color-fg)]">Glyphe SASU</strong>,
              RCS Paris 9XX XXX XXX, siège social rue de Vézelay 75008 Paris.
            </p>
            <p>
              Publication de presse financière au sens des art. L.621-31 du CMF
              et 20 du Règlement (UE) n° 596/2014 (MAR). Les analyses publiées
              ne constituent pas un conseil en investissement personnalisé.
            </p>
            <p>
              Les performances passées ne préjugent pas des performances
              futures. Investir comporte un risque de perte en capital.
            </p>
            <p>
              L'éditeur détient des positions sur la majorité des titres
              mentionnés. Voir la Transparency Policy.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fg-muted)]"
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="transition-colors hover:text-[color:var(--color-fg)]"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-fg-subtle)]">
          © {new Date().getFullYear()} Glyphe SASU · All rights reserved
        </p>
      </div>
    </footer>
  );
}
