export function SiteFooter() {
  return (
    <footer className="relative border-t border-[var(--color-stroke)] bg-black px-6 py-14 sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <svg
                viewBox="0 0 24 24"
                width={24}
                height={24}
                className="shuriken-stroke"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
                  fill="var(--color-amber)"
                />
                <circle cx="12" cy="12" r="1.6" fill="var(--color-ink)" />
              </svg>
              <span className="font-display text-lg font-medium">Ninja Money-verse</span>
            </div>
            <p className="mt-5 max-w-xs text-sm text-[var(--color-paper-dim)]">
              An open-source RPG that teaches money skills. For the dollar that comes in, the dollar
              that stays, and the dollar that grows.
            </p>
            <p className="mt-7 text-[10px] uppercase tracking-[0.22em] text-[var(--color-paper-muted)]">
              Not investment advice
            </p>
          </div>

          <FooterCol
            heading="Play"
            links={[
              { label: "Start a run", href: "/play" },
              { label: "How it works", href: "#how" },
              { label: "What we refuse", href: "#refuse" },
            ]}
          />
          <FooterCol
            heading="Build"
            links={[
              { label: "GitHub", href: "https://github.com/nikhil-vibing/Money-verse" },
              { label: "Architecture", href: "/docs/architecture" },
              {
                label: "Good first issues",
                href: "https://github.com/nikhil-vibing/Money-verse/contribute",
              },
            ]}
          />
          <FooterCol
            heading="Read"
            links={[
              { label: "Research brief", href: "/docs/research" },
              { label: "Accessibility", href: "/a11y" },
              { label: "Licence", href: "/licence" },
            ]}
          />
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-[var(--color-stroke)] pt-6 text-[11px] text-[var(--color-paper-muted)] sm:flex-row sm:items-center">
          <span>© Ninja Money-verse contributors · AGPL-3.0 · CC-BY 4.0 (art)</span>
          <span>Made with open source, in the open.</span>
        </div>
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
      <h3 className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-paper-muted)]">
        {heading}
      </h3>
      <ul className="mt-5 space-y-2.5 text-sm">
        {links.map((l) => {
          const isExternal = /^https?:\/\//.test(l.href);
          return (
            <li key={l.label}>
              <a
                href={l.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-[var(--color-paper)] transition-colors hover:text-[var(--color-amber)]"
              >
                {l.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
