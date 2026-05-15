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
        <a
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Ninja Money-verse home"
        >
          <span aria-hidden="true" className="relative grid h-7 w-7 place-items-center">
            <ShurikenMark />
          </span>
          <span className="font-display text-[15px] font-medium tracking-tight text-[var(--color-paper)]">
            Ninja Money-verse
          </span>
        </a>

        <a
          href="/play"
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[var(--color-paper)] px-3.5 text-[12px] font-medium text-[var(--color-ink)] transition hover:bg-white"
        >
          Play free
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </header>
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
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="var(--color-amber)" />
      <circle cx="12" cy="12" r="1.6" fill="var(--color-ink)" />
    </svg>
  );
}
