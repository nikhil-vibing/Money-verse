"use client";

import { useEffect, useState } from "react";

export function UtilityBar() {
  const [hidden, setHidden] = useState(false);
  const [locale, setLocale] = useState<"en" | "hi">("en");

  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 64 && y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-200 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
      role="banner"
    >
      <div className="border-b border-white/5 bg-[var(--color-bg)]/80 backdrop-blur-md">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-[12px] sm:px-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-5 w-5 place-items-center rounded-[3px] bg-[var(--color-saffron)] font-mono text-[10px] font-bold text-[var(--color-indigo-night)]"
            >
              ₹
            </span>
            <span className="font-display text-[13px] tracking-tight">
              Dhaniverse <span className="text-[var(--color-ink-muted)]">2.0</span>
            </span>
            <span className="hidden rounded-full bg-[var(--color-mint)]/15 px-2 py-0.5 text-[10px] text-[var(--color-mint)] sm:inline">
              Free forever · Open source
            </span>
          </div>
          <nav className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLocale((l) => (l === "en" ? "hi" : "en"))}
              className="rounded border border-white/10 px-2 py-0.5 text-[11px] uppercase tracking-wide hover:bg-white/5"
              aria-label="Toggle language"
            >
              {locale === "en" ? "EN" : "हिं"}
            </button>
            <a
              href="https://github.com"
              className="hidden items-center gap-1.5 rounded border border-white/10 px-2 py-0.5 text-[11px] hover:bg-white/5 sm:inline-flex"
              aria-label="GitHub repository"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 .5C5.4.5 0 5.9 0 12.5c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2.9-.3 2-.4 3-.4s2.1.1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.6 22.3 24 17.8 24 12.5 24 5.9 18.6.5 12 .5z" />
              </svg>
              <span>Star</span>
            </a>
            <a
              href="/play"
              className="rounded bg-[var(--color-saffron)] px-3 py-1 text-[11px] font-semibold text-[var(--color-indigo-night)] hover:bg-[var(--color-saffron-bright)]"
            >
              Play
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
