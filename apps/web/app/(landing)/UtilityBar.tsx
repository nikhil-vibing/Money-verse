"use client";

import { useEffect, useState } from "react";

export function UtilityBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "border-b border-[var(--color-stroke)] bg-[var(--color-ink)]/72 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="/" className="group flex items-center gap-2.5" aria-label="Ninja-Finance home">
          <span aria-hidden="true" className="relative grid h-7 w-7 place-items-center">
            <ShurikenMark />
          </span>
          <span className="font-display text-[15px] font-medium tracking-tight text-[var(--color-paper)]">
            Ninja-Finance
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          <NavLink href="#how">How it works</NavLink>
          <NavLink href="#refuse">What we refuse</NavLink>
          <NavLink href="#open">Open source</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-[var(--color-stroke)] bg-[var(--color-ink-2)]/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--color-paper-dim)] sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-jade)]" />
            Free forever
          </span>
          <a
            href="https://github.com/nikhil-vibing/Money-verse"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-8 items-center gap-1.5 rounded-md border border-[var(--color-stroke)] px-3 text-[12px] text-[var(--color-paper-dim)] transition hover:border-[var(--color-stroke-strong)] hover:text-[var(--color-paper)] sm:inline-flex"
            aria-label="GitHub repository"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.4.5 0 5.9 0 12.5c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2.9-.3 2-.4 3-.4s2.1.1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.6 22.3 24 17.8 24 12.5 24 5.9 18.6.5 12 .5z" />
            </svg>
            <span>Star</span>
          </a>
          <a
            href="/play"
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[var(--color-paper)] px-3.5 text-[12px] font-medium text-[var(--color-ink)] transition hover:bg-white"
          >
            Play free
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="text-[13px] text-[var(--color-paper-muted)] transition-colors hover:text-[var(--color-paper)]"
    >
      {children}
    </a>
  );
}

function ShurikenMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={26}
      height={26}
      className="shuriken-stroke"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
        fill="var(--color-crimson)"
      />
      <circle cx="12" cy="12" r="1.6" fill="var(--color-ink)" />
    </svg>
  );
}
