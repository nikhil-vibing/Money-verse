"use client";

import dynamic from "next/dynamic";
import { useMagneticHover } from "../../lib/motion";

const HeroBackdrop = dynamic(
  () => import("./HeroBackdrop").then((m) => ({ default: m.HeroBackdrop })),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 z-0 noise-bg" aria-hidden="true" />,
  },
);

export function HeroSection() {
  const ctaRef = useMagneticHover<HTMLAnchorElement>({ radius: 90, strength: 0.32 });

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden"
      aria-labelledby="hero-headline"
    >
      <div className="absolute inset-0 z-0 noise-bg" aria-hidden="true" />
      <HeroBackdrop />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-between px-6 pb-12 pt-28 sm:px-10 sm:pb-20 sm:pt-32">
        <div className="flex flex-1 flex-col justify-center">
          <div
            className="anim-fade-down mb-7 inline-flex w-fit items-center gap-2.5 rounded-full border border-[var(--color-stroke)] bg-[var(--color-ink-2)]/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--color-paper-dim)] backdrop-blur"
            style={{ animationDelay: "40ms" }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-crimson)]" />
            Pixel-art RPG · Open source · Plays in a browser
          </div>

          <h1
            id="hero-headline"
            className="font-display font-medium tracking-tight text-balance"
            style={{ fontSize: "clamp(2.6rem, 7vw + 1rem, 7rem)", lineHeight: 0.94 }}
          >
            <Line delay="120ms">The RPG that teaches</Line>
            <Line delay="260ms">
              <span className="italic font-normal text-[var(--color-crimson)]">real</span> money
              skills.
            </Line>
          </h1>

          <p
            className="anim-fade-up mt-7 max-w-xl text-base text-[var(--color-paper-dim)] sm:text-lg"
            style={{ animationDelay: "440ms" }}
          >
            Live a life inside a pixel-art city. Take quests, pay rent, dodge scams, build wealth —
            and pick up the lessons school skipped.
          </p>

          <div
            className="anim-fade-up mt-10 flex flex-wrap items-center gap-5"
            style={{ animationDelay: "580ms" }}
          >
            <a
              ref={ctaRef}
              href="/play"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[var(--color-paper)] px-7 py-3.5 text-[15px] font-medium text-[var(--color-ink)] transition-[box-shadow] duration-300 hover:shadow-[0_30px_80px_-20px_rgba(255,59,59,0.6)]"
              data-magnetic
            >
              <span className="relative z-10">Play free</span>
              <span
                aria-hidden="true"
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-0 z-0 translate-y-full bg-[var(--color-crimson)] transition-transform duration-500 ease-out group-hover:translate-y-0"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 z-[5] flex items-center gap-3 px-7 py-3.5 text-[var(--color-ink)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <span>Play free</span>
                <span>→</span>
              </span>
            </a>

            <a
              href="#how"
              className="group inline-flex items-center gap-2 text-[14px] text-[var(--color-paper-dim)] transition-colors hover:text-[var(--color-paper)]"
            >
              <span
                aria-hidden="true"
                className="grid h-7 w-7 place-items-center rounded-full border border-[var(--color-stroke)] transition-colors group-hover:border-[var(--color-stroke-strong)]"
              >
                <svg width="9" height="9" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
                  <path d="M0 0 L8 4 L0 8 Z" />
                </svg>
              </span>
              See how a quest plays
            </a>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="anim-fade-up mt-12 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[var(--color-paper-muted)] opacity-70"
          style={{ animationDelay: "900ms" }}
        >
          <span className="relative block h-9 w-px overflow-hidden bg-[var(--color-stroke)]">
            <span
              className="absolute inset-x-0 top-0 h-2 bg-[var(--color-crimson)]"
              style={{ animation: "scroll-cue 2.4s ease-in-out infinite" }}
            />
          </span>
          <span>Scroll · the world starts</span>
        </div>
      </div>
    </section>
  );
}

function Line({ children, delay }: { children: React.ReactNode; delay: string }) {
  return (
    <span className="block overflow-hidden">
      <span
        className="anim-rise inline-block will-change-transform"
        style={{ animationDelay: delay }}
      >
        {children}
      </span>
    </span>
  );
}
