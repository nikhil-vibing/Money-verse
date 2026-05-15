"use client";

import { useMagneticHover } from "../../lib/motion";

export function PlayBand() {
  const ctaRef = useMagneticHover<HTMLAnchorElement>({ radius: 120, strength: 0.32 });

  return (
    <section
      className="relative isolate overflow-hidden border-t border-[var(--color-stroke)] px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="play-band-h"
      style={{
        background:
          "linear-gradient(180deg, var(--color-ink) 0%, #2a1d10 45%, #4a3220 100%)",
      }}
    >
      <div aria-hidden="true" className="grain absolute inset-0 -z-10 opacity-25" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 mx-auto h-40 w-[60%] -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(244,185,66,0.45), transparent 70%)",
        }}
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2
          id="play-band-h"
          className="font-display text-5xl font-medium leading-[0.96] tracking-tight sm:text-7xl"
        >
          Step in.
        </h2>

        <a
          ref={ctaRef}
          href="/play"
          className="group relative mt-12 inline-flex items-center gap-3 overflow-hidden rounded-full bg-[var(--color-paper)] px-10 py-5 text-[17px] font-medium text-[var(--color-ink)] shadow-[0_30px_90px_-20px_rgba(244,185,66,0.5)] transition-shadow duration-300 hover:shadow-[0_40px_110px_-15px_rgba(244,185,66,0.6)]"
          data-magnetic
        >
          <span className="relative z-10">Play free</span>
          <span
            aria-hidden="true"
            className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5"
          >
            →
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 z-0 translate-y-full bg-[var(--color-amber)] transition-transform duration-500 ease-out group-hover:translate-y-0"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 z-[5] flex items-center justify-center gap-3 text-[var(--color-ink)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <span>Play free</span>
            <span>→</span>
          </span>
        </a>

        <p className="mt-8 text-[12px] uppercase tracking-[0.22em] text-[var(--color-paper-muted)]">
          Free · No signup · Open source
        </p>
      </div>
    </section>
  );
}
