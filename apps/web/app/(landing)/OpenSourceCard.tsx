export function OpenSourceCard() {
  return (
    <section
      className="relative border-t border-white/5 px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="oss-h"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-saffron)]">
              Open source
            </span>
            <h2
              id="oss-h"
              className="mt-3 font-display text-3xl font-medium leading-tight sm:text-5xl"
            >
              Made in the open.
              <br />
              <span className="text-[var(--color-ink-muted)]">
                Built on open source.
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-[var(--color-ink-muted)]">
              Every dependency in Dhaniverse 2.0 has a permissive licence. We
              only build what doesn't exist in the OSS world — Indian-context
              financial math, HD-2D-lite shaders, the quest engine. Everything
              else, we compose.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://github.com"
                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-sm hover:bg-white/5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 .5C5.4.5 0 5.9 0 12.5c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2.9-.3 2-.4 3-.4s2.1.1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.6 22.3 24 17.8 24 12.5 24 5.9 18.6.5 12 .5z" />
                </svg>
                Read the source
              </a>
              <a
                href="https://github.com"
                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-sm hover:bg-white/5"
              >
                Good first issues
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[var(--color-bg-2)] p-6 font-mono text-[12px] leading-relaxed text-[var(--color-ink-muted)] sm:p-8">
            <div className="mb-4 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-rose-dust)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-saffron)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-mint)]" />
              <span className="ml-2 text-[10px] uppercase tracking-[0.16em]">
                stack
              </span>
            </div>
            <Row k="game" v="phaser 3 + tiled + yarn spinner" />
            <Row k="web" v="next.js 16 · tailwind v4" />
            <Row k="realtime" v="colyseus + websocket" />
            <Row k="db" v="postgres (neon) + drizzle" />
            <Row k="auth" v="better-auth (self-hosted OSS)" />
            <Row k="ai tutor" v="ai gateway · open-weights default" />
            <Row k="licence" v="agpl-3.0 · cc-by 4.0 (art)" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/5 py-1.5 last:border-0">
      <span className="text-[var(--color-ink-muted)]/60">{k}</span>
      <span className="text-right text-[var(--color-ink)]">{v}</span>
    </div>
  );
}
