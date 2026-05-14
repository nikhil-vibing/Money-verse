"use client";

import { useMemo, useReducer } from "react";

const SALARY = 15_000;

type Bucket = "rent" | "save" | "spend";
type State = Record<Bucket, number>;

const initial: State = { rent: 0, save: 0, spend: 0 };

const presets: Array<{ label: string; values: State; note: string }> = [
  {
    label: "₹6k · ₹3k · ₹6k",
    values: { rent: 6_000, save: 3_000, spend: 6_000 },
    note: "Common, but Save is thin. One emergency wipes the savings.",
  },
  {
    label: "₹6k · ₹6k · ₹3k",
    values: { rent: 6_000, save: 6_000, spend: 3_000 },
    note: "Aunty approves. 40% saved compounds quickly at 21.",
  },
  {
    label: "₹4.5k · ₹4.5k · ₹6k",
    values: { rent: 4_500, save: 4_500, spend: 6_000 },
    note: "The 30·30·40 rule. Balanced — works if rent is genuinely possible.",
  },
];

function reducer(s: State, a: { bucket: Bucket; delta: number }): State {
  const next = Math.max(0, s[a.bucket] + a.delta);
  const others = SALARY - next - Object.entries(s).filter(([k]) => k !== a.bucket).reduce((acc, [, v]) => acc + v, 0);
  if (others < 0) return s;
  return { ...s, [a.bucket]: next };
}

export function PaydayDemo() {
  const [state, dispatch] = useReducer(reducer, initial);
  const remaining = SALARY - state.rent - state.save - state.spend;
  const allocated = SALARY - remaining;
  const fits = allocated === SALARY;

  const feedback = useMemo(() => {
    if (!fits) return "You've got ₹" + remaining.toLocaleString("en-IN") + " left to allocate.";
    if (state.save >= 0.3 * SALARY)
      return "CA Lakshmi aunty smiles. Saving 30%+ at this age compounds like a weed.";
    if (state.save >= 0.15 * SALARY)
      return "Reasonable. Your future self will be okay, not delighted.";
    if (state.spend > state.rent + state.save)
      return "Bhola seth notices. Spending more than rent + savings is the express lane to his EMI office.";
    return "Done. Try moving ₹1,000 from Spend to Save — see how aunty reacts.";
  }, [state, remaining, fits]);

  return (
    <section
      id="payday"
      className="relative border-t border-white/5 bg-[var(--color-bg-2)] px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="payday-h"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 max-w-2xl">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-saffron)]">
            A 30-second beat
          </span>
          <h2
            id="payday-h"
            className="mt-3 font-display text-3xl font-medium leading-tight sm:text-5xl"
          >
            It's your first payday.
            <br />
            <span className="text-[var(--color-ink-muted)]">Split ₹15,000 three ways.</span>
          </h2>
          <p className="mt-4 text-[var(--color-ink-muted)]">
            No signup. No score. This is how a Dhaniverse quest feels — you
            *do* the concept; the dialog comes after.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-6 sm:p-8">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
                  Salary in pocket
                </div>
                <div className="font-display text-3xl font-medium tabular-nums">
                  ₹{remaining.toLocaleString("en-IN")}
                  <span className="ml-2 text-base text-[var(--color-ink-muted)]">
                    / ₹15,000
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
                  Allocated
                </div>
                <div
                  className={`font-display text-xl font-medium tabular-nums ${
                    fits ? "text-[var(--color-mint)]" : "text-[var(--color-saffron)]"
                  }`}
                >
                  {Math.round((allocated / SALARY) * 100)}%
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <BucketRow
                bucket="rent"
                label="Rent"
                sub="Chawl room, water, basic electricity"
                color="var(--color-terracotta)"
                value={state.rent}
                onChange={(delta) => dispatch({ bucket: "rent", delta })}
              />
              <BucketRow
                bucket="save"
                label="Save"
                sub="Emergency fund, then SIP, then dreams"
                color="var(--color-mint)"
                value={state.save}
                onChange={(delta) => dispatch({ bucket: "save", delta })}
              />
              <BucketRow
                bucket="spend"
                label="Spend"
                sub="Chai, friends, the occasional treat"
                color="var(--color-saffron)"
                value={state.spend}
                onChange={(delta) => dispatch({ bucket: "spend", delta })}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    dispatch({ bucket: "rent", delta: p.values.rent - state.rent });
                    dispatch({ bucket: "save", delta: p.values.save - state.save });
                    dispatch({ bucket: "spend", delta: p.values.spend - state.spend });
                  }}
                  className="rounded border border-white/10 px-3 py-1.5 text-xs text-[var(--color-ink-muted)] hover:border-white/30 hover:text-[var(--color-ink)]"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[var(--color-indigo-night)] p-6">
            <div className="mb-3 flex items-center gap-3">
              <div
                aria-hidden
                className="pixel-edge grid h-10 w-10 place-items-center rounded bg-[var(--color-rose-dust)] text-lg"
              >
                👩🏽‍💼
              </div>
              <div>
                <div className="font-display text-sm">CA Lakshmi aunty</div>
                <div className="text-[11px] text-[var(--color-ink-muted)]">
                  Bank Bazaar district
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
              <span aria-live="polite">{feedback}</span>
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]/60">
              No real-money advice. No data leaves your browser.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BucketRow({
  bucket,
  label,
  sub,
  color,
  value,
  onChange,
}: {
  bucket: Bucket;
  label: string;
  sub: string;
  color: string;
  value: number;
  onChange: (delta: number) => void;
}) {
  const pct = Math.min(100, (value / SALARY) * 100);
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="font-display text-lg">{label}</div>
          <div className="text-xs text-[var(--color-ink-muted)]">{sub}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(-500)}
            disabled={value === 0}
            aria-label={`Decrease ${label} by 500`}
            className="grid h-9 w-9 place-items-center rounded border border-white/10 text-lg hover:bg-white/5 disabled:opacity-30"
          >
            −
          </button>
          <div className="w-24 text-right font-display tabular-nums">
            ₹{value.toLocaleString("en-IN")}
          </div>
          <button
            type="button"
            onClick={() => onChange(500)}
            aria-label={`Increase ${label} by 500`}
            className="grid h-9 w-9 place-items-center rounded border border-white/10 text-lg hover:bg-white/5"
          >
            +
          </button>
        </div>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-white/5"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={SALARY}
        aria-valuenow={value}
        aria-label={`${label} allocation`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
