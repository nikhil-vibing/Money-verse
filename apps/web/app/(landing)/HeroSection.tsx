import { HeroDiorama } from "./HeroDiorama";
import { HeroAtmosphereGate } from "./HeroAtmosphereGate";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[100svh] overflow-hidden pt-9"
      aria-labelledby="hero-headline"
    >
      <HeroDiorama />
      <HeroAtmosphereGate />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-2.25rem)] max-w-7xl flex-col justify-end px-6 pb-16 pt-24 sm:px-10 sm:pb-24">
        <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] text-[var(--color-ink-muted)] backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-mint)]" />
          Free forever · Open source · No accounts to start
        </span>

        <h1
          id="hero-headline"
          className="font-display text-[44px] font-medium leading-[0.98] tracking-tight sm:text-[64px] md:text-[80px] lg:text-[88px]"
        >
          Money,
          <span className="italic text-[var(--color-saffron)]"> as an adventure.</span>
          <br />
          <span className="text-[var(--color-ink-muted)]">
            Set in an India you'll recognise.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base text-[var(--color-ink-muted)] sm:text-lg">
          A hand-painted 2D RPG that teaches Indian financial literacy —
          without ever pretending speculation is a game. Open the door of your
          chawl, walk to the bank, file your first tax. Learn by doing.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="/play"
            className="group inline-flex items-center gap-3 rounded-md bg-[var(--color-saffron)] px-6 py-3.5 text-base font-semibold text-[var(--color-indigo-night)] shadow-[0_0_0_1px_rgba(247,183,51,0.4),0_24px_60px_-20px_rgba(247,183,51,0.5)] transition hover:bg-[var(--color-saffron-bright)]"
          >
            Step into Money-verse
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href="#payday"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] underline-offset-4 hover:underline"
          >
            <span aria-hidden>▶</span>
            Try a 30-second beat
          </a>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]/70">
          <span>Curriculum mapped to</span>
          <span className="text-[var(--color-ink-muted)]">NCFE</span>
          <span aria-hidden>·</span>
          <span className="text-[var(--color-ink-muted)]">SEBI</span>
          <span aria-hidden>·</span>
          <span className="text-[var(--color-ink-muted)]">Zerodha Varsity</span>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-48 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/60 to-transparent"
      />
    </section>
  );
}
