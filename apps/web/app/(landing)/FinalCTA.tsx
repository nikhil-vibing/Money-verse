export function FinalCTA() {
  return (
    <section
      className="relative isolate overflow-hidden border-t border-white/5 px-6 py-28 sm:px-10 sm:py-40"
      aria-labelledby="final-h"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 100%, rgba(247,183,51,0.15), transparent 60%), radial-gradient(40% 60% at 50% 0%, rgba(200,113,86,0.15), transparent 60%), #0a0612",
        }}
      />
      <div
        aria-hidden
        className="grain-overlay absolute inset-0 -z-10 opacity-[0.12]"
      />

      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="final-h"
          className="font-display text-4xl font-medium leading-tight sm:text-6xl md:text-7xl"
        >
          The door is open.
          <br />
          <span className="italic text-[var(--color-saffron)]">Step in.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[var(--color-ink-muted)]">
          Browser. No install. No card. No account to start. The first quest
          takes about ten minutes and ends with you knowing one new thing.
        </p>
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="/play"
            className="group inline-flex items-center gap-3 rounded-md bg-[var(--color-saffron)] px-8 py-4 text-lg font-semibold text-[var(--color-indigo-night)] shadow-[0_0_0_1px_rgba(247,183,51,0.4),0_30px_80px_-20px_rgba(247,183,51,0.5)] transition hover:bg-[var(--color-saffron-bright)]"
          >
            Step into Money-verse
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href="#payday"
            className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            Or try the 30-second beat again
          </a>
        </div>
        <p className="mt-12 text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-muted)]/60">
          Free forever · Open source · No accounts to start
        </p>
      </div>
    </section>
  );
}
