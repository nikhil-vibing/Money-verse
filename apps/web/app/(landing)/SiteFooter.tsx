export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-black px-6 py-12 sm:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="grid h-6 w-6 place-items-center rounded-[3px] bg-[var(--color-saffron)] font-mono text-xs font-bold text-[var(--color-indigo-night)]"
            >
              ₹
            </span>
            <span className="font-display text-lg">Dhaniverse 2.0</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-[var(--color-ink-muted)]">
            Built in the open. For the rupee that comes in, the rupee that
            stays, and the rupee that grows.
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-muted)]/60">
            Not investment advice
          </p>
        </div>

        <FooterCol
          heading="Play"
          links={[
            { label: "Open the game", href: "/play" },
            { label: "Curriculum", href: "/learn" },
            { label: "Districts", href: "#districts" },
          ]}
        />
        <FooterCol
          heading="Build"
          links={[
            { label: "GitHub", href: "https://github.com" },
            { label: "Architecture", href: "/docs/architecture" },
            { label: "Good first issues", href: "https://github.com" },
            { label: "Discord", href: "https://discord.com" },
          ]}
        />
        <FooterCol
          heading="Read"
          links={[
            { label: "PRD", href: "/docs/prd" },
            { label: "Masters research", href: "/docs/masters" },
            { label: "Accessibility", href: "/a11y" },
            { label: "Licence", href: "/licence" },
          ]}
        />
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 text-[11px] text-[var(--color-ink-muted)]/60 sm:flex-row sm:items-center">
        <span>© Dhaniverse contributors · AGPL-3.0 · CC-BY 4.0 (art)</span>
        <span>Made with open source. Made in India.</span>
      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
        {heading}
      </h3>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-[var(--color-ink)] hover:text-[var(--color-saffron)]"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
