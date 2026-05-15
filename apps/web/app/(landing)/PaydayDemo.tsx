"use client";

import { useMemo, useState } from "react";

/**
 * PaydayDemo — Sensei Wren's first lesson, playable inline.
 *
 * The visitor gets a fictional $1,500 paycheque and three envelopes
 * (Rent, Save, Spend). Sensei Wren's reaction branches on whether the
 * Save envelope clears a small buffer threshold — mirroring the
 * `MAYA_REACTION_BALANCED` / `MAYA_REACTION_SHAKY` branch in the game,
 * with original landing-page copy (game lines stay in the game).
 */

const PAYCHEQUE = 1500;
const RENT = 600;
const REMAINING = PAYCHEQUE - RENT; // 900
const SAVE_BALANCED_MIN = 250;

const PROMPT_LINES: ReadonlyArray<string> = [
  "You just earned $1,500.",
  "Rent is $600. That part is decided.",
  "Pick three buckets for the $900 that's left. I'm watching.",
];

const BALANCED_LINES: ReadonlyArray<string> = [
  "Good. You saw the shape of it.",
  "Now go buy tea. A coin or two over budget is fine.",
];

const SHAKY_LINES: ReadonlyArray<string> = [
  "Save is thin. One bad week wipes it.",
  "Try again. The drawer doesn't run away.",
];

type BucketId = "save" | "spend" | "stash";

type BucketSpec = {
  id: BucketId;
  label: string;
  hint: string;
};

const BUCKETS: ReadonlyArray<BucketSpec> = [
  { id: "save", label: "Save", hint: "Future-you" },
  { id: "spend", label: "Spend", hint: "Tea, food, bus" },
  { id: "stash", label: "Stash", hint: "Tomorrow's idea" },
];

type Allocation = Record<BucketId, number>;

const INITIAL_ALLOCATION: Allocation = {
  save: 300,
  spend: 450,
  stash: 150,
};

export function PaydayDemo() {
  const [alloc, setAlloc] = useState<Allocation>(INITIAL_ALLOCATION);
  const [confirmed, setConfirmed] = useState(false);

  const total = alloc.save + alloc.spend + alloc.stash;
  const overBudget = total > REMAINING;
  const underBudget = total < REMAINING;

  const grade = useMemo<"balanced" | "shaky">(() => {
    if (alloc.save >= SAVE_BALANCED_MIN && !overBudget) return "balanced";
    return "shaky";
  }, [alloc.save, overBudget]);

  const senseiLines = confirmed
    ? grade === "balanced"
      ? BALANCED_LINES
      : SHAKY_LINES
    : PROMPT_LINES;

  const updateBucket = (id: BucketId, raw: number) => {
    const clamped = Math.max(0, Math.min(REMAINING, Math.round(raw)));
    setAlloc((prev) => ({ ...prev, [id]: clamped }));
    setConfirmed(false);
  };

  const reset = () => {
    setAlloc(INITIAL_ALLOCATION);
    setConfirmed(false);
  };

  return (
    <section
      id="payday"
      className="relative border-t border-[var(--color-stroke)] bg-[var(--color-ink)] px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="payday-h"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <h2
            id="payday-h"
            className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-5xl"
          >
            Try it. Split your first paycheque.
          </h2>
          <p className="mt-5 max-w-md text-[var(--color-paper-dim)]">
            No lesson before the body owns it. Sensei Wren is in the room.
          </p>

          <div className="mt-10 flex items-start gap-4 rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-ink-2)]/60 p-5">
            <div
              className="pixelated h-16 w-16 shrink-0 rounded-md border border-[var(--color-stroke)] bg-[var(--color-ink)]"
              style={{
                backgroundImage: "url(/landing/characters/faceset/3.png)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "180%",
              }}
              role="img"
              aria-label="Sensei Wren"
            />
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-amber)]">
                Sensei Wren
              </div>
              <output
                aria-live="polite"
                aria-atomic="true"
                className="mt-1 block font-display text-lg leading-snug text-[var(--color-paper)]"
              >
                {senseiLines.map((line, idx) => (
                  <span
                    key={`${confirmed ? grade : "prompt"}-${idx}`}
                    className="block"
                  >
                    {line}
                  </span>
                ))}
              </output>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-ink-2)] p-6 sm:p-7">
          <div className="flex items-baseline justify-between border-b border-[var(--color-stroke)] pb-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-paper-muted)]">
              Drawer
            </span>
            <span className="font-display text-2xl font-medium text-[var(--color-amber)]">
              ${REMAINING}
            </span>
          </div>

          <ul className="mt-5 space-y-5">
            {BUCKETS.map((b) => (
              <li key={b.id}>
                <div className="flex items-baseline justify-between">
                  <label htmlFor={`bucket-${b.id}`} className="flex items-baseline gap-3">
                    <span className="font-display text-[17px] font-medium text-[var(--color-paper)]">
                      {b.label}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-paper-muted)]">
                      {b.hint}
                    </span>
                  </label>
                  <span className="font-mono text-sm tabular-nums text-[var(--color-paper-dim)]">
                    ${alloc[b.id]}
                  </span>
                </div>
                <input
                  id={`bucket-${b.id}`}
                  type="range"
                  min={0}
                  max={REMAINING}
                  step={25}
                  value={alloc[b.id]}
                  onChange={(e) => updateBucket(b.id, Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--color-amber)]"
                />
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t border-[var(--color-stroke)] pt-4">
            <div className="text-[12px] text-[var(--color-paper-muted)]">
              <span className="font-mono tabular-nums">${total}</span>
              <span className="mx-1.5">/</span>
              <span className="font-mono tabular-nums">${REMAINING}</span>
              {overBudget && (
                <span className="ml-3 text-[var(--color-crimson)]">over by ${total - REMAINING}</span>
              )}
              {underBudget && (
                <span className="ml-3 text-[var(--color-paper-dim)]">
                  ${REMAINING - total} unspent
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={reset}
                className="rounded-md border border-[var(--color-stroke)] px-3 py-1.5 text-[12px] text-[var(--color-paper-dim)] transition hover:border-[var(--color-stroke-strong)] hover:text-[var(--color-paper)]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmed(true)}
                disabled={overBudget}
                className="rounded-md bg-[var(--color-paper)] px-3.5 py-1.5 text-[12px] font-medium text-[var(--color-ink)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm split
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
