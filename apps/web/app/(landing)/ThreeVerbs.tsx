type Verb = {
  word: string;
  line: string;
  icon: string;
  alt: string;
};

const VERBS: ReadonlyArray<Verb> = [
  {
    word: "Train.",
    line: "Sensei Wren shows you the moves. Three envelopes, one drawer.",
    icon: "/landing/hud/kunai.png",
    alt: "Kunai",
  },
  {
    word: "Save.",
    line: "Future-you needs a buffer. The dojo helps you build one.",
    icon: "/landing/items/gold-coin.png",
    alt: "Gold coin",
  },
  {
    word: "Strike.",
    line: "The Lender is polite. Learn to walk past him anyway.",
    icon: "/landing/hud/shuriken.png",
    alt: "Shuriken",
  },
];

export function ThreeVerbs() {
  return (
    <section
      className="relative border-t border-[var(--color-stroke)] bg-[var(--color-ink)] px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="verbs-h"
    >
      <h2 id="verbs-h" className="sr-only">
        Three verbs
      </h2>
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3 sm:gap-7">
        {VERBS.map((v) => (
          <article
            key={v.word}
            className="group relative overflow-hidden rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-ink-2)]/60 p-7 transition-colors hover:border-[var(--color-stroke-strong)]"
          >
            <div className="flex items-start gap-5">
              <div
                className="pixelated h-14 w-14 shrink-0"
                style={{
                  backgroundImage: `url(${v.icon})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.4))",
                }}
                role="img"
                aria-label={v.alt}
              />
              <div>
                <div className="font-display text-4xl font-medium text-[var(--color-paper)]">
                  {v.word}
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-paper-dim)]">
                  {v.line}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
