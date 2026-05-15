export function SiteFooter() {
  return (
    <footer className="relative border-t border-[var(--color-stroke)] bg-black px-6 py-10 sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <svg
            viewBox="0 0 24 24"
            width={20}
            height={20}
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
          <span className="font-display text-sm font-medium">Ninja Money-verse</span>
          <span className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-stroke)] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[var(--color-paper-muted)]">
            Free · Open source
          </span>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[var(--color-paper-dim)]"
        >
          <a
            href="https://github.com/nikhil-vibing/Money-verse"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--color-paper)]"
          >
            GitHub
          </a>
          <a
            href="mailto:hello@ninja-money-verse.app"
            className="transition-colors hover:text-[var(--color-paper)]"
          >
            Contact
          </a>
          <span className="text-[var(--color-paper-muted)]">AGPL-3.0 · CC0 art</span>
          <span className="text-[var(--color-paper-muted)]">Not financial advice</span>
        </nav>
      </div>
    </footer>
  );
}
