"use client";

import { useInView } from "../../lib/motion";

const testimonials = [
  {
    quote:
      "It's the first game that didn't make me feel dumb about money. The aunt who plays a CA gave me a thirty-second lesson on tax that finally clicked.",
    name: "Aria, 19",
    where: "Tokyo · CS sophomore",
  },
  {
    quote:
      "I stopped checking my brokerage app every five minutes after a single Ninja Money-verse quest. Boring is the point.",
    name: "Dylan, 24",
    where: "Brooklyn · designer",
  },
  {
    quote:
      "Open source means I can read why it tells me to save instead of trade. That alone made me trust it.",
    name: "Mei, 22",
    where: "London · econ grad",
  },
];

export function ProofSection() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section
      className="relative border-t border-[var(--color-stroke)] bg-[var(--color-ink)] px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="proof-h"
    >
      <div ref={ref} className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-xl">
            <Eyebrow>The players</Eyebrow>
            <h2
              id="proof-h"
              className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-5xl"
            >
              Built in public.
              <br />
              <span className="italic font-normal text-[var(--color-paper-muted)]">
                Played in earnest.
              </span>
            </h2>
          </div>

          <a
            href="https://github.com/nikhil-vibing/Money-verse"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-ink-2)]/60 px-5 py-3.5 backdrop-blur transition hover:border-[var(--color-stroke-strong)]"
          >
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-md bg-[var(--color-ink-3)]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5C5.4.5 0 5.9 0 12.5c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2.9-.3 2-.4 3-.4s2.1.1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.6 22.3 24 17.8 24 12.5 24 5.9 18.6.5 12 .5z" />
              </svg>
            </span>
            <span className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-paper-muted)]">
                Open source · AGPL-3.0
              </span>
              <span className="font-display text-[15px] font-medium text-[var(--color-paper)]">
                nikhil-vibing/Money-verse
              </span>
            </span>
            <span
              aria-hidden="true"
              className="text-[var(--color-paper-muted)] transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>

        <ul className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <li
              key={t.name}
              className="relative rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-ink-2)]/40 p-6 backdrop-blur transition-[opacity,transform] duration-700 ease-out"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${i * 140}ms`,
              }}
            >
              <svg
                aria-hidden="true"
                className="mb-5 text-[var(--color-amber)]"
                width="28"
                height="22"
                viewBox="0 0 28 22"
                fill="currentColor"
              >
                <path d="M0 22V12C0 5.4 4.5 0.6 11.2 0V4.8C8 5.4 6 7.6 6 11.2H11.2V22H0ZM16.8 22V12C16.8 5.4 21.3 0.6 28 0V4.8C24.8 5.4 22.8 7.6 22.8 11.2H28V22H16.8Z" />
              </svg>
              <p className="text-[15px] leading-relaxed text-[var(--color-paper-dim)]">{t.quote}</p>
              <div className="mt-6 border-t border-[var(--color-stroke)] pt-4">
                <div className="font-display text-[14px] font-medium text-[var(--color-paper)]">
                  {t.name}
                </div>
                <div className="mt-0.5 text-[12px] text-[var(--color-paper-muted)]">{t.where}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--color-amber)]">
      <span className="h-px w-6 bg-[var(--color-amber)]" />
      {children}
    </span>
  );
}
