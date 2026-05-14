"use client";

import { useInView } from "../../lib/motion";

const refusals = [
  "No confetti when you 'win' a speculative trade.",
  "No leaderboards ranking players by P&L.",
  "No notifications hyping volatility.",
  "No 'biggest movers' lists engineered for fear.",
  "No paywalled lessons. Ever.",
  "No surprise-stock rewards. No spin-the-wheel. No lottery.",
];

export function AntiPromise() {
  const { ref, inView } = useInView<HTMLUListElement>({ threshold: 0.1 });

  return (
    <section
      id="refuse"
      className="relative isolate overflow-hidden border-y border-[var(--color-stroke)] bg-black px-6 py-28 sm:px-10 sm:py-40"
      aria-labelledby="refuse-h"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,59,59,0.14), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245,180,58,0.06), transparent 60%)",
        }}
      />
      <div aria-hidden="true" className="grain absolute inset-0 -z-10 opacity-30" />

      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>The line we won't cross</Eyebrow>
        <h2
          id="refuse-h"
          className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
        >
          Things this game will{" "}
          <span className="italic font-normal text-[var(--color-crimson)]">never</span> do.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[var(--color-paper-dim)]">
          A generation watched apps treat their first dollar like a slot machine. We picked the
          other side on day one — and we'll be there on day one thousand.
        </p>

        <ul
          ref={ref}
          className="mx-auto mt-16 max-w-2xl divide-y divide-[var(--color-stroke)] border-y border-[var(--color-stroke)]"
        >
          {refusals.map((r, i) => (
            <li
              key={r}
              className="flex items-center gap-5 px-2 py-5 text-left transition-[opacity,transform] duration-700 ease-out sm:px-4"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : "translateX(-12px)",
                transitionDelay: `${i * 90}ms`,
              }}
            >
              <span
                aria-hidden="true"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--color-stroke-strong)] text-[var(--color-crimson)]"
              >
                <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                  <path
                    d="M2 2 L10 10 M10 2 L2 10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="font-display text-[17px] font-medium leading-snug text-[var(--color-paper)] sm:text-xl">
                {r}
              </span>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-14 max-w-xl text-[15px] text-[var(--color-paper-dim)]">
          What we <em className="italic text-[var(--color-paper)]">do</em> celebrate: consistency.
          Reading the page. Saying no. The boring decisions that compound into a life.
        </p>
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[var(--color-crimson)]">
      <span className="h-px w-8 bg-[var(--color-crimson)]" />
      {children}
      <span className="h-px w-8 bg-[var(--color-crimson)]" />
    </span>
  );
}
