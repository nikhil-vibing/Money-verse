"use client";

import { useInView } from "../../lib/motion";

const audiences = [
  {
    tag: "For the curious",
    title: "Players, 13 – 26.",
    body: "You've watched friends lose money. You don't want to be the next one. Ten-minute beats fit between classes, between trains, between shifts.",
    bullets: [
      "No tickers. No portfolios.",
      "No spreadsheet skills required.",
      "Save your run, come back tomorrow.",
    ],
    accent: "var(--color-amber)",
  },
  {
    tag: "For the educators",
    title: "Parents, teachers, mentors.",
    body: "A free open-source curriculum that you can read end-to-end. Nothing about it tries to convert your kid into a day-trader.",
    bullets: [
      "Aligned to public financial-literacy frameworks.",
      "AGPL source — fork it for your classroom.",
      "Zero ads. Zero tracking. Zero upsells.",
    ],
    accent: "var(--color-moss)",
  },
];

export function PersonaSection() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section
      className="relative border-t border-[var(--color-stroke)] bg-[var(--color-ink)] px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="who-h"
    >
      <div ref={ref} className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-xl">
          <Eyebrow>Who it's for</Eyebrow>
          <h2
            id="who-h"
            className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-5xl"
          >
            Two doors.
            <br />
            <span className="italic font-normal text-[var(--color-paper-muted)]">Same city.</span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {audiences.map((a, i) => (
            <article
              key={a.tag}
              className="group relative overflow-hidden rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-ink-2)]/60 p-8 backdrop-blur transition-[opacity,transform] duration-700 ease-out sm:p-10"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView
                  ? "translateX(0)"
                  : i === 0
                    ? "translateX(-24px)"
                    : "translateX(24px)",
                transitionDelay: `${i * 160}ms`,
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full blur-3xl transition-opacity duration-700 group-hover:opacity-60"
                style={{
                  background: `radial-gradient(circle, ${a.accent}, transparent 70%)`,
                  opacity: 0.25,
                }}
              />
              <div className="relative">
                <div
                  className="text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: a.accent }}
                >
                  {a.tag}
                </div>
                <h3 className="mt-3 font-display text-2xl font-medium leading-tight sm:text-3xl">
                  {a.title}
                </h3>
                <p className="mt-4 max-w-md text-[var(--color-paper-dim)]">{a.body}</p>
                <ul className="mt-8 space-y-3">
                  {a.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-[14px] text-[var(--color-paper-dim)]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: a.accent }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
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
