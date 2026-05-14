const pillars = [
  {
    title: "Hide the lesson in the verb.",
    body: "You learn compounding by growing a sapling, not by reading a chapter. The dialog comes after the action.",
    citation: "DragonBox · Foldit · CodeCombat",
  },
  {
    title: "Mastery, not grind.",
    body: "The next district unlocks when you can show you understand this one — not after N hours played.",
    citation: "Khan Academy mastery learning",
  },
  {
    title: "Forgiveness, not punishment.",
    body: "We warn before we fail. Streaks freeze, not break. A bad day doesn't erase three months.",
    citation: "Celeste · Duolingo",
  },
  {
    title: "Free forever, no dark patterns.",
    body: "No confetti on speculative wins. No leaderboards by P&L. No paywalled lessons. The Robinhood-era playbook is the anti-playbook.",
    citation: "Zerodha Varsity",
  },
];

export function PillarsRail() {
  return (
    <section
      className="relative border-t border-white/5 bg-[var(--color-bg-2)] px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="pillars-h"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-saffron)]">
            Four promises
          </span>
          <h2
            id="pillars-h"
            className="mt-3 font-display text-3xl font-medium leading-tight sm:text-5xl"
          >
            How this is built.
          </h2>
          <p className="mt-4 text-[var(--color-ink-muted)]">
            Every design choice traces to a documented master — the people who
            actually shipped great learning, great games, or great financial
            education. We name them on purpose.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="flex flex-col rounded-xl border border-white/10 bg-black/30 p-6"
            >
              <h3 className="font-display text-lg font-medium leading-snug">
                {p.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {p.body}
              </p>
              <div className="mt-5 inline-flex w-fit rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)]/80">
                {p.citation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
