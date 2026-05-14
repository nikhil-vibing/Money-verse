"use client";

import { useEffect, useState } from "react";
import { useInView } from "../../lib/motion";

const lines = [
  { prompt: "$", body: "git clone github.com/nikhil-vibing/Money-verse" },
  { prompt: ">", body: "Cloning into 'ninja-finance'..." },
  { prompt: ">", body: "remote: Counting objects: 4,128 ✓" },
  { prompt: "$", body: "pnpm install && pnpm dev" },
  { prompt: ">", body: "ready · http://localhost:3000" },
];

export function OpenSourceSection() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const [typedCount, setTypedCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTypedCount(i);
      if (i >= lines.length) window.clearInterval(id);
    }, 520);
    return () => window.clearInterval(id);
  }, [inView]);

  return (
    <section
      id="open"
      className="relative border-t border-[var(--color-stroke)] bg-[var(--color-ink)] px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="open-h"
    >
      <div ref={ref} className="mx-auto max-w-6xl">
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow>Built in public</Eyebrow>
            <h2
              id="open-h"
              className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-tight sm:text-5xl"
            >
              Free forever.
              <br />
              <span className="italic font-normal text-[var(--color-paper-muted)]">
                Open to all.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-[var(--color-paper-dim)]">
              Every dependency in Ninja-Finance has a permissive licence. The math is readable. The
              dialog is on GitHub. If something feels wrong, you can open the file and see exactly
              why.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 text-sm sm:max-w-md">
              <Stat k="Licence" v="AGPL-3.0" />
              <Stat k="Art" v="CC-BY 4.0" />
              <Stat k="Stack" v="OSS only" />
              <Stat k="Telemetry" v="None" />
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="https://github.com/nikhil-vibing/Money-verse"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-stroke-strong)] px-5 py-2.5 text-sm transition hover:bg-[var(--color-ink-2)]"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .5C5.4.5 0 5.9 0 12.5c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2.9-.3 2-.4 3-.4s2.1.1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.6 22.3 24 17.8 24 12.5 24 5.9 18.6.5 12 .5z" />
                </svg>
                Read the source
              </a>
              <a
                href="https://github.com/nikhil-vibing/Money-verse/contribute"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-stroke)] px-5 py-2.5 text-sm text-[var(--color-paper-dim)] transition hover:border-[var(--color-stroke-strong)] hover:text-[var(--color-paper)]"
              >
                Join the build
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <Terminal typedCount={typedCount} />
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-1 border-l border-[var(--color-stroke)] pl-4">
      <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-paper-muted)]">
        {k}
      </dt>
      <dd className="font-display text-[17px] font-medium text-[var(--color-paper)]">{v}</dd>
    </div>
  );
}

function Terminal({ typedCount }: { typedCount: number }) {
  return (
    <figure
      className="relative rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-ink-2)]/80 p-6 font-mono text-[12.5px] leading-relaxed shadow-2xl backdrop-blur sm:p-8"
      aria-label="Terminal preview"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-crimson)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-amber)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-jade)]" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-paper-muted)]">
          ~/ninja-finance · zsh
        </span>
      </div>
      <div className="space-y-1.5">
        {lines.map((l, i) => (
          <div
            key={`${l.prompt}-${l.body}`}
            className={`transition-opacity duration-300 ${
              i < typedCount ? "opacity-100" : "opacity-0"
            }`}
          >
            <span
              className={
                l.prompt === "$" ? "text-[var(--color-crimson)]" : "text-[var(--color-paper-muted)]"
              }
            >
              {l.prompt}
            </span>{" "}
            <span
              className={
                l.prompt === "$"
                  ? `text-[var(--color-paper)]${i === typedCount - 1 ? " terminal-cursor" : ""}`
                  : "text-[var(--color-paper-dim)]"
              }
            >
              {l.body}
            </span>
          </div>
        ))}
        {typedCount >= lines.length && (
          <div className="pt-2 text-[var(--color-jade)]">✓ open the browser. you're in.</div>
        )}
      </div>
    </figure>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--color-crimson)]">
      <span className="h-px w-6 bg-[var(--color-crimson)]" />
      {children}
    </span>
  );
}
