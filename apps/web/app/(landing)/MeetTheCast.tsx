type CastCard = {
  name: string;
  role: string;
  quote: string;
  portrait: string;
  /** Polaroid rotation in degrees — alternated for visual rhythm. */
  tiltDeg: number;
};

const CAST: ReadonlyArray<CastCard> = [
  {
    name: "Sensei Wren",
    role: "Your first teacher",
    quote: "Sit. Tea first. Lesson after.",
    portrait: "/landing/characters/faceset/3.png",
    tiltDeg: -3,
  },
  {
    name: "Kai",
    role: "Tea cart at the corner",
    quote: "Seven a day. Times three sixty-five. Quiet math.",
    portrait: "/landing/characters/faceset/4.png",
    tiltDeg: 2.5,
  },
  {
    name: "Mara",
    role: "Keeps the corner shop",
    quote: "Onions are up. Bread is down. We adjust.",
    portrait: "/landing/characters/faceset/25.png",
    tiltDeg: -2,
  },
  {
    name: "Arlo",
    role: "Your friend with new shoes",
    quote: "Bro. Three payments. Basically free, right?",
    portrait: "/landing/characters/faceset/20.png",
    tiltDeg: 3,
  },
  {
    name: "The Lender",
    role: "Smiles too easily",
    quote: "Sign here. The other page is just paper.",
    portrait: "/landing/characters/faceset/12.png",
    tiltDeg: -2.5,
  },
  {
    name: "Biscuit",
    role: "Dojo dog",
    quote: "*wags tail*",
    portrait: "/landing/characters/faceset/dog.png",
    tiltDeg: 2,
  },
];

export function MeetTheCast() {
  return (
    <section
      className="relative border-t border-[var(--color-stroke)] bg-[var(--color-ink-2)] px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="cast-h"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="cast-h"
          className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-5xl"
        >
          People you&rsquo;ll meet.
        </h2>

        <ul className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {CAST.map((c) => (
            <li key={c.name}>
              <article
                className="group relative h-full rounded-md border border-[var(--color-stroke)] bg-[var(--color-paper)] p-4 text-[var(--color-ink)] shadow-[0_22px_60px_-30px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:!rotate-0 hover:scale-[1.015]"
                style={{ transform: `rotate(${c.tiltDeg}deg)` }}
              >
                <div className="relative aspect-square overflow-hidden rounded-sm bg-[var(--color-ink)]">
                  <div
                    className="pixelated absolute inset-0"
                    style={{
                      backgroundImage: `url(${c.portrait})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "180%",
                      imageRendering: "pixelated",
                    }}
                    aria-hidden="true"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.25) 100%)",
                    }}
                  />
                </div>

                <div className="mt-4 px-1 pb-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-lg font-medium leading-tight">
                      {c.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#7a6648]">
                      {c.role}
                    </span>
                  </div>
                  <p className="mt-3 font-display text-[15px] italic leading-snug text-[#3a2a18]">
                    &ldquo;{c.quote}&rdquo;
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
