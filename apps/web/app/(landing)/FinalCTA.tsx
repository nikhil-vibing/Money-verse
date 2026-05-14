"use client";

import { useMagneticHover } from "../../lib/motion";

export function FinalCTA() {
  const ctaRef = useMagneticHover<HTMLAnchorElement>({ radius: 110, strength: 0.32 });

  return (
    <section
      className="relative isolate overflow-hidden border-t border-[var(--color-stroke)] bg-[var(--color-ink)] px-6 py-32 sm:px-10 sm:py-44"
      aria-labelledby="final-h"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(60% 80% at 50% 100%, rgba(255,59,59,0.16), transparent 60%), radial-gradient(40% 60% at 50% 0%, rgba(245,180,58,0.08), transparent 60%)",
        }}
      />
      <div aria-hidden="true" className="grain absolute inset-0 -z-10 opacity-20" />

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[var(--color-crimson)]">
          <span className="h-px w-8 bg-[var(--color-crimson)]" />
          The door is open
          <span className="h-px w-8 bg-[var(--color-crimson)]" />
        </span>

        <h2
          id="final-h"
          className="mt-8 font-display text-5xl font-medium leading-[0.96] tracking-tight sm:text-7xl md:text-[88px]"
        >
          Pick up the
          <br />
          <span className="italic font-normal text-[var(--color-crimson)]">first quest.</span>
        </h2>

        <p className="mx-auto mt-8 max-w-lg text-[var(--color-paper-dim)]">
          The first run takes about ten minutes. No account. No card. No email. When you leave,
          you'll know one thing you didn't know this morning.
        </p>

        <div className="mt-14 flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
          <a
            ref={ctaRef}
            href="/play"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[var(--color-paper)] px-10 py-5 text-[17px] font-medium text-[var(--color-ink)] shadow-[0_30px_90px_-20px_rgba(255,59,59,0.55)] transition-shadow duration-300 hover:shadow-[0_40px_110px_-15px_rgba(255,59,59,0.7)]"
            data-magnetic
          >
            <span className="relative z-10">Start playing free</span>
            <span
              aria-hidden="true"
              className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5"
            >
              →
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0 z-0 translate-y-full bg-[var(--color-crimson)] transition-transform duration-500 ease-out group-hover:translate-y-0"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 z-[5] flex items-center justify-center gap-3 text-[var(--color-ink)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <span>Start playing free</span>
              <span>→</span>
            </span>
          </a>

          <a
            href="#how"
            className="text-[14px] text-[var(--color-paper-dim)] underline-offset-4 hover:text-[var(--color-paper)] hover:underline"
          >
            Or read how it works again
          </a>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-[var(--color-paper-muted)]">
          <Stamp>No account</Stamp>
          <span aria-hidden="true">·</span>
          <Stamp>No card</Stamp>
          <span aria-hidden="true">·</span>
          <Stamp>No ads</Stamp>
          <span aria-hidden="true">·</span>
          <Stamp>Open source</Stamp>
        </div>
      </div>
    </section>
  );
}

function Stamp({ children }: { children: string }) {
  return <span>{children}</span>;
}
