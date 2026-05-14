const refusals = [
  "No confetti on speculative wins.",
  "No leaderboards by P&L.",
  "No notifications hyping volatility.",
  "No paywalled lessons. Ever.",
];

export function AntiPromiseBand() {
  return (
    <section
      className="relative border-y border-white/10 bg-black px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="anti-h"
    >
      <div className="mx-auto max-w-5xl text-center">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-rose-dust)]">
          The line we won't cross
        </span>
        <h2
          id="anti-h"
          className="mt-4 font-display text-3xl font-medium leading-tight text-white sm:text-5xl"
        >
          What this game will <em className="italic">never</em> do.
        </h2>
        <ul className="mx-auto mt-12 max-w-2xl divide-y divide-white/10 border-y border-white/10">
          {refusals.map((r) => (
            <li
              key={r}
              className="flex items-center gap-4 py-5 text-left font-display text-lg font-medium"
            >
              <span
                aria-hidden
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/20 text-sm"
              >
                ✕
              </span>
              {r}
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-12 max-w-xl text-sm text-white/60">
          These are the patterns that broke a generation's relationship with
          money. We rejected them on day one and we'll reject them on day 1,000.
        </p>
      </div>
    </section>
  );
}
