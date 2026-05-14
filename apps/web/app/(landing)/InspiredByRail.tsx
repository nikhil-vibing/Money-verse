const inspirations = [
  { name: "Stardew Valley", note: "authored worlds with memory" },
  { name: "Celeste", note: "accessibility without shame" },
  { name: "Sea of Stars", note: "modern 2D craft" },
  { name: "Duolingo", note: "the 5-minute daily ritual" },
  { name: "Khan Academy", note: "mastery, not time" },
  { name: "Zerodha Varsity", note: "Indian, free, forever" },
  { name: "DragonBox", note: "hide the lesson in the verb" },
];

export function InspiredByRail() {
  return (
    <section
      className="relative border-t border-white/5 bg-[var(--color-bg-2)] px-6 py-20 sm:px-10"
      aria-labelledby="inspired-h"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="inspired-h"
          className="mb-8 text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-muted)]"
        >
          Honest attribution — inspired by, with our own ingredients
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {inspirations.map((i) => (
            <li
              key={i.name}
              className="rounded-lg border border-white/5 p-4"
            >
              <div className="font-display text-sm">{i.name}</div>
              <div className="mt-1 text-[11px] leading-snug text-[var(--color-ink-muted)]">
                {i.note}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
