const personas = [
  {
    name: "Ananya, 21",
    where: "CS student · Bengaluru",
    need: "Wants to be 'the cousin who knows about money.'",
    outcome:
      "Plays in 10-minute beats between lectures. Hits a 30-day streak. Sends quest screenshots to her chat.",
    tone: "var(--color-saffron)",
  },
  {
    name: "Rohit, 27",
    where: "Software engineer · Pune",
    need: "Has a SIP someone set up for him. Got burned ₹40k on F&O last year.",
    outcome:
      "Replays a Niveshak Chowk quest at 1am. Stops asking Twitter what to buy. Stays in the index.",
    tone: "var(--color-mint)",
  },
  {
    name: "Saanvi, 16",
    where: "Class 11 · Delhi",
    need: "School doesn't teach personal finance. Wants to understand the UPI on her dad's phone.",
    outcome:
      "Plays on mobile. Toggles Hindi when she wants. Asks better questions at the dinner table.",
    tone: "var(--color-rose-dust)",
  },
];

export function PersonaTriptych() {
  return (
    <section
      className="relative border-t border-white/5 px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="who-h"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-saffron)]">
            For whom
          </span>
          <h2
            id="who-h"
            className="mt-3 font-display text-3xl font-medium leading-tight sm:text-5xl"
          >
            Three people we built this for.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {personas.map((p) => (
            <div
              key={p.name}
              className="rounded-xl border border-white/10 bg-[var(--color-bg-2)] p-6"
            >
              <div
                aria-hidden
                className="pixel-edge mb-5 grid h-12 w-12 place-items-center rounded font-display text-lg font-semibold"
                style={{ background: p.tone, color: "var(--color-indigo-night)" }}
              >
                {p.name.charAt(0)}
              </div>
              <h3 className="font-display text-xl font-medium">{p.name}</h3>
              <div className="text-xs text-[var(--color-ink-muted)]">{p.where}</div>
              <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
                <span className="block text-[var(--color-ink)]">Need.</span>
                {p.need}
              </p>
              <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
                <span className="block text-[var(--color-ink)]">Outcome.</span>
                {p.outcome}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
