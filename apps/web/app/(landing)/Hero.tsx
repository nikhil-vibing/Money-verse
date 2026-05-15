"use client";

import { useMagneticHover } from "../../lib/motion";

/**
 * Hero — 2.5D pixel diorama composed from real game sprites.
 *
 * The four NPCs share a 64x112 (4 cols × 7 rows of 16×16) layout. We
 * surface a single 16×16 cell — the down-facing idle frame, top-left —
 * by scaling the full sprite up via background-image positioning. The
 * sprite is then rendered with `image-rendering: pixelated` to keep the
 * pixels crisp at any DPR.
 *
 * Each NPC pulses on a staggered yoyo (mirrors the `scaleY 1 → 0.97`
 * trick used in `apps/game/src/entities/Npc.ts`), so the line of sprites
 * breathes without anyone needing JS animation libs.
 */
type CastMember = {
  name: string;
  sheet: string;
  /** Sheet pixel width — needed for background-size math. */
  sheetWidth: number;
  sheetHeight: number;
  /** Frame index (0..N) reading left-to-right, top-to-bottom. Frame 0 is down-idle. */
  frame: number;
  /** Cell dimensions inside the sheet. NA chars are 16×16; dog is 16×16 inside a 32×16 sheet. */
  cellWidth: number;
  cellHeight: number;
  /** Render size on screen in px. */
  renderHeight: number;
  /** Animation delay in ms. */
  delayMs: number;
  /** Optional offset to anchor the sprite onto the ground baseline. */
  groundOffsetY?: number;
};

const CAST: ReadonlyArray<CastMember> = [
  {
    name: "Mara",
    sheet: "/landing/characters/25.png",
    sheetWidth: 64,
    sheetHeight: 112,
    frame: 0,
    cellWidth: 16,
    cellHeight: 16,
    renderHeight: 112,
    delayMs: 0,
  },
  {
    name: "Sensei Wren",
    sheet: "/landing/characters/3.png",
    sheetWidth: 64,
    sheetHeight: 112,
    frame: 0,
    cellWidth: 16,
    cellHeight: 16,
    renderHeight: 128,
    delayMs: 180,
  },
  {
    name: "Kai",
    sheet: "/landing/characters/4.png",
    sheetWidth: 64,
    sheetHeight: 112,
    frame: 0,
    cellWidth: 16,
    cellHeight: 16,
    renderHeight: 112,
    delayMs: 360,
  },
  {
    name: "Biscuit",
    sheet: "/landing/characters/dog.png",
    sheetWidth: 32,
    sheetHeight: 16,
    frame: 0,
    cellWidth: 16,
    cellHeight: 16,
    renderHeight: 56,
    delayMs: 540,
    groundOffsetY: 36,
  },
];

export function Hero() {
  const ctaRef = useMagneticHover<HTMLAnchorElement>({ radius: 90, strength: 0.32 });

  return (
    <section
      className="relative isolate overflow-hidden"
      aria-labelledby="hero-headline"
    >
      <div aria-hidden="true" className="absolute inset-0 z-0 noise-bg" />
      <div aria-hidden="true" className="grain absolute inset-0 z-0 opacity-30" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-0 h-[80%]"
        style={{
          backgroundImage:
            "radial-gradient(60% 70% at 50% 30%, rgba(244,185,66,0.18), transparent 70%), radial-gradient(50% 50% at 20% 80%, rgba(106,156,67,0.10), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-between px-6 pb-12 pt-24 sm:px-10 sm:pb-16 sm:pt-32">
        <div className="flex flex-1 flex-col-reverse items-center gap-12 lg:flex-row lg:items-center lg:gap-14">
          <div className="w-full max-w-xl">
            <h1
              id="hero-headline"
              className="anim-fade-up font-display font-medium tracking-tight text-balance"
              style={{
                fontSize: "clamp(2.4rem, 6vw + 1rem, 5.5rem)",
                lineHeight: 0.96,
                animationDelay: "120ms",
              }}
            >
              Money, like a{" "}
              <span className="italic font-normal text-[var(--color-amber)]">ninja</span> learns it.
            </h1>

            <p
              className="anim-fade-up mt-6 max-w-md text-base text-[var(--color-paper-dim)] sm:text-lg"
              style={{ animationDelay: "260ms" }}
            >
              A free pixel-art game. Earn. Save. Spend. Strike.
            </p>

            <div
              className="anim-fade-up mt-8 flex flex-wrap items-center gap-5"
              style={{ animationDelay: "400ms" }}
            >
              <a
                ref={ctaRef}
                href="/play"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[var(--color-paper)] px-7 py-3.5 text-[15px] font-medium text-[var(--color-ink)] transition-[box-shadow] duration-300 hover:shadow-[0_30px_80px_-20px_rgba(244,185,66,0.5)]"
                data-magnetic
              >
                <span className="relative z-10">Play in your browser</span>
                <span
                  aria-hidden="true"
                  className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 z-0 translate-y-full bg-[var(--color-amber)] transition-transform duration-500 ease-out group-hover:translate-y-0"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 z-[5] flex items-center justify-center gap-3 text-[var(--color-ink)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <span>Play in your browser</span>
                  <span>→</span>
                </span>
              </a>

              <button
                type="button"
                className="group inline-flex items-center gap-2 text-[14px] text-[var(--color-paper-dim)] transition-colors hover:text-[var(--color-paper)]"
              >
                <span
                  aria-hidden="true"
                  className="grid h-7 w-7 place-items-center rounded-full border border-[var(--color-stroke)] transition-colors group-hover:border-[var(--color-stroke-strong)]"
                >
                  <svg width="9" height="9" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
                    <path d="M0 0 L8 4 L0 8 Z" />
                  </svg>
                </span>
                Watch the first dojo (60s)
              </button>
            </div>

            <p
              className="anim-fade-up mt-6 text-[11px] uppercase tracking-[0.2em] text-[var(--color-paper-muted)]"
              style={{ animationDelay: "560ms" }}
            >
              Plays in a browser · No signup
            </p>
          </div>

          <HeroDiorama />
        </div>
      </div>
    </section>
  );
}

function HeroDiorama() {
  return (
    <div className="relative w-full max-w-[640px]" aria-hidden="true">
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[var(--color-stroke)] bg-[var(--color-ink-2)]"
        style={{
          boxShadow:
            "0 30px 80px -30px rgba(244,185,66,0.25), inset 0 1px 0 rgba(244,236,208,0.04)",
        }}
      >
        <DioramaBackdrop />
        <DioramaGround />

        <div className="absolute inset-x-0 bottom-[18%] flex items-end justify-center gap-7 sm:gap-10">
          {CAST.map((c) => (
            <PixelSprite key={c.name} member={c} />
          ))}
        </div>

        <SparkleAboveSensei />
        <CartCoin />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(17,13,8,0) 60%, rgba(17,13,8,0.55) 100%)",
          }}
        />
      </div>
    </div>
  );
}

function DioramaBackdrop() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #2a2118 0%, #3d2818 55%, #5c3a20 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 top-[10%] mx-auto h-24 w-24 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(244,185,66,0.5), rgba(244,185,66,0) 70%)",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <SilhouetteSkyline />
    </>
  );
}

function SilhouetteSkyline() {
  return (
    <svg
      viewBox="0 0 640 200"
      className="absolute inset-x-0 top-[14%] w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ height: "44%" }}
    >
      <path
        d="M0,160 L0,110 L40,110 L40,80 L70,80 L70,100 L110,100 L110,60 L150,60 L150,90 L200,90 L200,40 L260,40 L260,70 L320,70 L320,50 L380,50 L380,80 L430,80 L430,60 L490,60 L490,100 L540,100 L540,80 L590,80 L590,110 L640,110 L640,160 Z"
        fill="#1c1610"
        opacity="0.92"
      />
      <path
        d="M0,200 L0,150 L70,150 L70,130 L140,130 L140,160 L220,160 L220,140 L300,140 L300,150 L380,150 L380,130 L460,130 L460,160 L540,160 L540,140 L640,140 L640,200 Z"
        fill="#110d08"
      />
    </svg>
  );
}

function DioramaGround() {
  return (
    <div
      className="absolute inset-x-0 bottom-0 h-[22%]"
      style={{
        background:
          "linear-gradient(180deg, #4a3324 0%, #2a1d12 100%)",
        boxShadow: "inset 0 1px 0 rgba(244,236,208,0.06)",
      }}
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 14px, rgba(0,0,0,0.18) 14px 16px)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

function PixelSprite({ member }: { member: CastMember }) {
  const scale = member.renderHeight / member.cellHeight;
  const cols = Math.max(1, member.sheetWidth / member.cellWidth);
  const row = Math.floor(member.frame / cols);
  const col = member.frame % cols;
  const offsetX = col * member.cellWidth;
  const offsetY = row * member.cellHeight;

  return (
    <div
      className="anim-idle-pulse pixelated relative"
      style={{
        width: member.cellWidth * scale,
        height: member.cellHeight * scale,
        marginBottom: member.groundOffsetY ?? 0,
        animationDelay: `${member.delayMs}ms`,
        backgroundImage: `url(${member.sheet})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: `-${offsetX * scale}px -${offsetY * scale}px`,
        backgroundSize: `${member.sheetWidth * scale}px ${member.sheetHeight * scale}px`,
        filter:
          "drop-shadow(0 4px 0 rgba(0,0,0,0.35))",
      }}
      aria-label={member.name}
    />
  );
}

function SparkleAboveSensei() {
  return (
    <div
      className="anim-coin-float pixelated absolute"
      style={{
        left: "calc(50% - 8px)",
        top: "26%",
        width: 32,
        height: 32,
        backgroundImage: "url(/landing/fx/sparkle.gif)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
      }}
      aria-hidden="true"
    />
  );
}

function CartCoin() {
  return (
    <div
      className="anim-coin-float pixelated absolute"
      style={{
        right: "20%",
        bottom: "44%",
        width: 24,
        height: 24,
        backgroundImage: "url(/landing/items/coin-2.gif)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        animationDelay: "300ms",
      }}
      aria-hidden="true"
    />
  );
}
