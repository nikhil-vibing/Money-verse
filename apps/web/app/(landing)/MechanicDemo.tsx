"use client";

import { useRef } from "react";
import { useScrollProgress } from "../../lib/motion";

const beats = [
  {
    label: "01",
    title: "Open the world.",
    body: "You wake in a single room in the old quarter. Rent is due in nine days. A sensei lives upstairs.",
  },
  {
    label: "02",
    title: "Take a quest.",
    body: "Mara at the corner shop needs help cutting her costs. You see her ledger. You make the call.",
  },
  {
    label: "03",
    title: "Learn the lesson after.",
    body: "The math gets named only after the body owns it. You leave knowing one new thing — and feeling it.",
  },
];

export function MechanicDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(sectionRef);

  const activeBeat = Math.min(2, Math.max(0, Math.floor(progress * 3.4)));

  return (
    <section
      id="how"
      ref={sectionRef}
      className="relative border-t border-[var(--color-stroke)] bg-[var(--color-ink-2)] px-6 py-32 sm:px-10 sm:py-40"
      aria-labelledby="how-h"
    >
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1fr_1.1fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>How it works</Eyebrow>
          <h2
            id="how-h"
            className="mt-4 font-display text-3xl font-medium leading-[1.04] tracking-tight sm:text-5xl"
          >
            You don't read a lesson.
            <br />
            <span className="italic font-normal text-[var(--color-paper-muted)]">
              You live one.
            </span>
          </h2>
          <p className="mt-6 max-w-md text-[var(--color-paper-dim)]">
            Each chamber teaches a virtue — attention, patience, duty, the patient strike, defense,
            making your own coin, the long path. You unlock the next by showing the body owns this
            one.
          </p>

          <output aria-live="polite" aria-atomic="true" className="sr-only">
            {beats[activeBeat] ? `Beat ${activeBeat + 1} of 3: ${beats[activeBeat]?.title}` : ""}
          </output>

          <ol className="mt-12 space-y-1.5">
            {beats.map((b, i) => (
              <li
                key={b.label}
                aria-current={i === activeBeat ? "step" : undefined}
                className={`flex items-start gap-4 rounded-xl border px-4 py-4 transition-all duration-500 ${
                  i === activeBeat
                    ? "border-[var(--color-amber)]/60 bg-[var(--color-amber)]/[0.06]"
                    : "border-transparent bg-transparent"
                }`}
              >
                <span
                  className={`font-mono text-[11px] tracking-wider transition-colors ${
                    i === activeBeat
                      ? "text-[var(--color-amber)]"
                      : "text-[var(--color-paper-muted)]"
                  }`}
                >
                  {b.label}
                </span>
                <div>
                  <div
                    className={`font-display text-[17px] font-medium transition-colors ${
                      i === activeBeat
                        ? "text-[var(--color-paper)]"
                        : "text-[var(--color-paper-dim)]"
                    }`}
                  >
                    {b.title}
                  </div>
                  <div className="mt-1 text-[13px] leading-relaxed text-[var(--color-paper-muted)]">
                    {b.body}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <MockScene activeBeat={activeBeat} />
      </div>
    </section>
  );
}

function MockScene({ activeBeat }: { activeBeat: number }) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[28px] bg-gradient-to-br from-[var(--color-amber)]/20 via-transparent to-[var(--color-moss)]/15 blur-2xl"
      />
      <div className="relative aspect-[5/6] overflow-hidden rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-ink)] shadow-2xl">
        <SkyGradient activeBeat={activeBeat} />
        <CityScene activeBeat={activeBeat} />
        <GameUI activeBeat={activeBeat} />
      </div>
      <div className="mt-4 flex items-center justify-between px-1 text-[11px] text-[var(--color-paper-muted)]">
        <span className="font-mono">browser · no install</span>
        <span className="font-mono">↑ scroll to advance</span>
      </div>
    </div>
  );
}

function SkyGradient({ activeBeat }: { activeBeat: number }) {
  const skies = [
    "linear-gradient(180deg, #1c1610 0%, #2a2118 40%, #3d2818 100%)",
    "linear-gradient(180deg, #2a2118 0%, #8b4a2f 40%, #b56a3e 100%)",
    "linear-gradient(180deg, #1c1610 0%, #3d2818 30%, #f4b942 90%, #ffd166 100%)",
  ];
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 transition-[background] duration-1000 ease-out"
      style={{ background: skies[activeBeat] ?? skies[0] }}
    />
  );
}

function CityScene({ activeBeat }: { activeBeat: number }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-[12%] flex justify-center">
        <Stars />
      </div>

      <div
        className="absolute inset-x-0 bottom-0 transition-transform duration-1000 ease-out"
        style={{ transform: `translateY(${activeBeat * -4}%)` }}
      >
        <Cityscape />
      </div>

      <div
        className="absolute bottom-[22%] left-1/2 -translate-x-1/2 transition-[transform,opacity] duration-700"
        style={{
          transform: `translateX(calc(-50% + ${activeBeat * 30}px))`,
        }}
      >
        <PixelCharacter />
      </div>
    </div>
  );
}

function Stars() {
  return (
    <svg viewBox="0 0 320 60" className="h-12 w-full opacity-60" aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => {
        const x = (i * 53) % 320;
        const y = (i * 11) % 60;
        const r = (i % 3) * 0.4 + 0.6;
        const key = `star-${x}-${y}`;
        return <circle key={key} cx={x} cy={y} r={r} fill="#f4ecd0" opacity={0.6} />;
      })}
    </svg>
  );
}

function Cityscape() {
  return (
    <svg viewBox="0 0 320 180" className="w-full" aria-hidden="true">
      <rect x="0" y="120" width="40" height="60" fill="#0a0a0f" />
      <rect x="44" y="90" width="36" height="90" fill="#1c1610" />
      <rect x="50" y="98" width="6" height="6" fill="#f4b942" />
      <rect x="62" y="98" width="6" height="6" fill="#f4b942" />
      <rect x="50" y="112" width="6" height="6" fill="#f4b942" opacity="0.5" />

      <rect x="84" y="60" width="48" height="120" fill="#0a0a0f" />
      <rect x="92" y="68" width="8" height="8" fill="#f4b942" />
      <rect x="108" y="68" width="8" height="8" fill="#f4b942" />
      <rect x="92" y="84" width="8" height="8" fill="#8b4a2f" />
      <rect x="108" y="100" width="8" height="8" fill="#f4b942" opacity="0.6" />

      <rect x="136" y="100" width="32" height="80" fill="#1c1610" />
      <rect x="142" y="108" width="6" height="6" fill="#f4b942" />

      <rect x="172" y="40" width="56" height="140" fill="#0a0a0f" />
      <rect x="180" y="48" width="8" height="8" fill="#f4b942" />
      <rect x="196" y="48" width="8" height="8" fill="#f4b942" />
      <rect x="212" y="64" width="8" height="8" fill="#8b4a2f" />
      <rect x="180" y="80" width="8" height="8" fill="#f4b942" opacity="0.7" />
      <rect x="196" y="96" width="8" height="8" fill="#f4b942" />

      <rect x="232" y="80" width="44" height="100" fill="#1c1610" />
      <rect x="240" y="88" width="6" height="6" fill="#f4b942" />
      <rect x="254" y="88" width="6" height="6" fill="#f4b942" />

      <rect x="280" y="110" width="40" height="70" fill="#0a0a0f" />
      <rect x="288" y="118" width="6" height="6" fill="#f4b942" />
    </svg>
  );
}

function PixelCharacter() {
  return (
    <svg viewBox="0 0 32 40" width={56} height={70} aria-hidden="true">
      <rect x="11" y="4" width="10" height="10" fill="#f6d4b3" />
      <rect x="11" y="2" width="10" height="4" fill="#2a2118" />
      <rect x="13" y="8" width="2" height="2" fill="#0a0a0f" />
      <rect x="17" y="8" width="2" height="2" fill="#0a0a0f" />
      <rect x="14" y="12" width="4" height="1" fill="#8b4a2f" />
      <rect x="9" y="14" width="14" height="14" fill="#6a9c43" />
      <rect x="9" y="14" width="14" height="2" fill="#f4b942" />
      <rect x="9" y="28" width="6" height="10" fill="#2a2118" />
      <rect x="17" y="28" width="6" height="10" fill="#2a2118" />
      <rect x="5" y="16" width="4" height="8" fill="#f6d4b3" />
      <rect x="23" y="16" width="4" height="8" fill="#f6d4b3" />
    </svg>
  );
}

function GameUI({ activeBeat }: { activeBeat: number }) {
  const dialogs = [
    {
      who: "Inner monologue",
      text: "First morning. Bed creaks. Tea tin is half-empty. Rent in 9.",
    },
    {
      who: "Mara · corner shop",
      text: "Tea is up. Bread is down. I keep paying for things I forget I bought. Look?",
    },
    {
      who: "You",
      text: "You catch the leak. She thanks you with a stamp on her ledger. The city remembers.",
    },
  ];
  const d = dialogs[activeBeat] ?? dialogs[0];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-4 bottom-4 rounded-lg border border-[var(--color-stroke-strong)] bg-[var(--color-ink)]/86 p-4 backdrop-blur-md transition-all duration-500"
    >
      <div className="mb-1.5 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[var(--color-amber)]">
        <span className="h-1 w-1 rounded-full bg-[var(--color-amber)]" />
        {d?.who}
      </div>
      <div className="font-display text-[14px] leading-snug text-[var(--color-paper)]">
        {d?.text}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-[var(--color-paper-muted)]">
        <span>{activeBeat + 1} / 3</span>
        <span className="font-mono">SPACE to continue</span>
      </div>
    </div>
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
