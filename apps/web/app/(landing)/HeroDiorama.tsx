"use client";

import { useEffect, useRef } from "react";

export function HeroDiorama() {
  const ref = useRef<HTMLDivElement>(null);
  const planes = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      planes.current.forEach((p, i) => {
        if (!p) return;
        const depth = (i + 1) * 5;
        p.style.transform = `translate3d(${-currentX * depth}px, ${
          -currentY * depth * 0.4
        }px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };

    root.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
    };
  }, []);

  const setPlane = (i: number) => (el: HTMLDivElement | null) => {
    if (el) planes.current[i] = el;
  };

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 z-0 select-none overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1a0830 0%, #2e1042 18%, #6b1d4f 38%, #c84e2e 58%, #f7b733 72%, #ffe09a 80%, #5a2240 92%, #150828 100%)",
        }}
      />

      <div className="absolute inset-0">
        <Stars />
      </div>

      <div
        ref={setPlane(0)}
        className="absolute inset-0 will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 50% 32% at 72% 42%, rgba(255,228,156,0.55) 0%, rgba(247,183,51,0.25) 35%, transparent 70%)",
        }}
      />

      <div
        ref={setPlane(1)}
        className="pixel-edge absolute inset-x-0 bottom-0 h-[58%] will-change-transform"
      >
        <DistantHills />
      </div>

      <div
        ref={setPlane(2)}
        className="pixel-edge absolute inset-x-0 bottom-0 h-[52%] will-change-transform"
      >
        <FarSkyline />
      </div>

      <div
        ref={setPlane(3)}
        className="pixel-edge absolute inset-x-0 bottom-0 h-[42%] will-change-transform"
      >
        <MidSkyline />
      </div>

      <div
        ref={setPlane(4)}
        className="pixel-edge absolute inset-x-0 bottom-0 h-[36%] will-change-transform"
      >
        <ForegroundAlley />
      </div>

      <div
        className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
        aria-hidden
      />
      <div
        className="crt-overlay pointer-events-none absolute inset-0 opacity-25"
        aria-hidden
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center 110%, transparent 30%, rgba(10,6,18,0.7) 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-50"
        style={{ backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 opacity-50"
        style={{ backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
      />
    </div>
  );
}

const STAR_DOTS = Array.from({ length: 56 }).map((_, i) => ({
  x: (i * 173) % 1000,
  y: ((i * 89) % 280) + 8,
  s: i % 7 === 0 ? 2 : 1,
  o: 0.4 + ((i * 13) % 5) * 0.12,
  twinkle: i % 5 === 0,
}));

function Stars() {
  return (
    <svg
      viewBox="0 0 1000 400"
      preserveAspectRatio="xMidYMin slice"
      className="h-full w-full"
      shapeRendering="crispEdges"
    >
      {STAR_DOTS.map((s, i) => (
        <rect
          key={i}
          x={s.x}
          y={s.y}
          width={s.s}
          height={s.s}
          fill="#fff5d6"
          opacity={s.o}
        >
          {s.twinkle && (
            <animate
              attributeName="opacity"
              values={`${s.o};${s.o * 0.3};${s.o}`}
              dur={`${2.5 + (i % 4) * 0.6}s`}
              repeatCount="indefinite"
            />
          )}
        </rect>
      ))}
    </svg>
  );
}

function DistantHills() {
  return (
    <svg
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMax slice"
      className="h-full w-full"
      shapeRendering="crispEdges"
    >
      <defs>
        <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d1845" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1c0a2e" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path
        d="M0,380 L60,340 L140,360 L220,310 L300,335 L380,295 L460,320 L540,280 L640,310 L720,275 L820,300 L900,270 L1000,295 L1100,265 L1200,290 L1200,500 L0,500 Z"
        fill="url(#hillGrad)"
      />
      <path
        d="M0,420 L100,395 L200,410 L320,380 L420,400 L540,370 L660,395 L780,365 L900,390 L1020,360 L1120,385 L1200,370 L1200,500 L0,500 Z"
        fill="#180826"
        opacity="0.85"
      />
    </svg>
  );
}

function FarSkyline() {
  const buildings = [
    { x: 30, w: 36, h: 90 },
    { x: 70, w: 24, h: 130 },
    { x: 98, w: 44, h: 110 },
    { x: 150, w: 32, h: 160 },
    { x: 186, w: 26, h: 100 },
    { x: 218, w: 48, h: 180 },
    { x: 274, w: 28, h: 120 },
    { x: 308, w: 36, h: 200 },
    { x: 350, w: 30, h: 140 },
    { x: 386, w: 50, h: 230 },
    { x: 442, w: 32, h: 160 },
    { x: 480, w: 28, h: 110 },
    { x: 514, w: 44, h: 190 },
    { x: 564, w: 30, h: 130 },
    { x: 600, w: 38, h: 220 },
    { x: 646, w: 28, h: 150 },
    { x: 680, w: 42, h: 180 },
    { x: 730, w: 30, h: 100 },
    { x: 766, w: 36, h: 170 },
    { x: 808, w: 26, h: 200 },
    { x: 840, w: 44, h: 130 },
    { x: 890, w: 32, h: 180 },
    { x: 928, w: 28, h: 110 },
    { x: 962, w: 40, h: 210 },
    { x: 1008, w: 28, h: 140 },
    { x: 1042, w: 36, h: 170 },
    { x: 1084, w: 32, h: 120 },
    { x: 1122, w: 44, h: 190 },
  ];
  return (
    <svg
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMax slice"
      className="h-full w-full"
      shapeRendering="crispEdges"
    >
      <defs>
        <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#240e36" stopOpacity="0.0" />
          <stop offset="55%" stopColor="#1a0729" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#100420" />
        </linearGradient>
        <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7b733" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f7b733" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1200" height="500" fill="url(#far)" />
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={500 - b.h} width={b.w} height={b.h} fill="#0e0420" />
          <rect x={b.x} y={500 - b.h} width={b.w} height="2" fill="url(#rim)" />
          {Array.from({ length: Math.floor((b.h - 20) / 14) }).flatMap((_, r) =>
            Array.from({ length: Math.floor((b.w - 6) / 8) }).map((_, c) => {
              const idx = (i * 11 + r * 5 + c * 3) % 17;
              if (idx === 0 || idx === 3 || idx === 9) {
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={b.x + 3 + c * 8}
                    y={500 - b.h + 12 + r * 14}
                    width="2"
                    height="3"
                    fill="#f7b733"
                    opacity={0.55 + (idx % 3) * 0.1}
                  />
                );
              }
              return null;
            }),
          )}
          {b.h > 150 && (
            <g fill="#1a0a26">
              <rect x={b.x + b.w / 2 - 5} y={500 - b.h - 8} width="10" height="6" />
              <rect x={b.x + b.w / 2 - 1} y={500 - b.h - 14} width="2" height="6" />
            </g>
          )}
        </g>
      ))}
      <g stroke="#1f0a30" strokeWidth="0.5" fill="none">
        <line x1="240" y1="320" x2="240" y2="295" />
        <line x1="411" y1="270" x2="411" y2="240" />
        <line x1="619" y1="280" x2="619" y2="252" />
        <line x1="982" y1="290" x2="982" y2="262" />
      </g>
    </svg>
  );
}

function MidSkyline() {
  const buildings = [
    { x: 0, w: 130, h: 280, terracotta: true },
    { x: 130, w: 90, h: 320, terracotta: false },
    { x: 220, w: 140, h: 240, terracotta: false },
    { x: 360, w: 100, h: 360, terracotta: true },
    { x: 460, w: 90, h: 280, terracotta: false },
    { x: 550, w: 130, h: 340, terracotta: false },
    { x: 680, w: 80, h: 250, terracotta: false },
    { x: 760, w: 120, h: 380, terracotta: true },
    { x: 880, w: 90, h: 260, terracotta: false },
    { x: 970, w: 110, h: 320, terracotta: false },
    { x: 1080, w: 120, h: 360, terracotta: true },
  ];
  return (
    <svg
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMax slice"
      className="h-full w-full"
      shapeRendering="crispEdges"
    >
      <defs>
        <linearGradient id="mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0418" stopOpacity="0" />
          <stop offset="100%" stopColor="#080214" />
        </linearGradient>
      </defs>
      <rect x="0" y="200" width="1200" height="300" fill="url(#mid)" />
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={500 - b.h} width={b.w} height={b.h} fill="#0a0418" />
          {b.terracotta && (
            <>
              <polygon
                points={`${b.x},${500 - b.h} ${b.x + b.w / 2},${500 - b.h - 14} ${b.x + b.w},${500 - b.h}`}
                fill="#9b4f3a"
              />
              <polygon
                points={`${b.x + 4},${500 - b.h + 2} ${b.x + b.w / 2},${500 - b.h - 10} ${b.x + b.w - 4},${500 - b.h + 2}`}
                fill="#c87156"
              />
            </>
          )}
          <rect
            x={b.x}
            y={500 - b.h + (b.terracotta ? 4 : 0)}
            width={b.w}
            height="2"
            fill="#f7b733"
            opacity="0.4"
          />
          {Array.from({ length: Math.floor((b.h - 30) / 20) }).flatMap((_, r) =>
            Array.from({ length: Math.floor((b.w - 12) / 18) }).map((_, c) => {
              const lit = ((i * 7 + r * 3 + c * 5) % 9) < 4;
              const x = b.x + 8 + c * 18;
              const y = 500 - b.h + 22 + r * 20;
              return (
                <g key={`w-${r}-${c}`}>
                  <rect x={x} y={y} width="6" height="9" fill="#1a0a26" />
                  {lit && (
                    <rect
                      x={x + 1}
                      y={y + 1}
                      width="4"
                      height="7"
                      fill="#f7b733"
                      opacity={0.6 + (((i + r + c) * 11) % 4) * 0.1}
                    />
                  )}
                </g>
              );
            }),
          )}
          {b.h > 280 && i % 2 === 0 && (
            <g>
              <circle cx={b.x + 18} cy={500 - b.h - 6} r="5" fill="#2a1242" />
              <rect x={b.x + 17} y={500 - b.h - 6} width="2" height="8" fill="#2a1242" />
            </g>
          )}
          {b.h > 300 && (
            <g fill="#2a1242">
              <rect x={b.x + b.w - 24} y={500 - b.h - 10} width="16" height="10" />
              <rect x={b.x + b.w - 21} y={500 - b.h - 16} width="2" height="6" />
              <rect x={b.x + b.w - 13} y={500 - b.h - 16} width="2" height="6" />
            </g>
          )}
          {i === 3 && (
            <g>
              <line
                x1={b.x + b.w}
                y1={500 - b.h + 40}
                x2={b.x + b.w + 60}
                y2={500 - b.h + 50}
                stroke="#cbb89c"
                strokeWidth="0.5"
                strokeDasharray="2,2"
                opacity="0.5"
              />
              <rect x={b.x + b.w + 10} y={500 - b.h + 42} width="6" height="10" fill="#c87156" />
              <rect x={b.x + b.w + 22} y={500 - b.h + 46} width="5" height="8" fill="#6dd3a0" />
              <rect x={b.x + b.w + 35} y={500 - b.h + 48} width="6" height="9" fill="#f5f1ea" opacity="0.6" />
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

function ForegroundAlley() {
  return (
    <svg
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMax slice"
      className="h-full w-full"
      shapeRendering="crispEdges"
    >
      <defs>
        <radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffe9a3" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#f7b733" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f7b733" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="steam" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#f5f1ea" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f5f1ea" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="340" width="1200" height="160" fill="#0a0410" />
      <rect x="0" y="332" width="1200" height="8" fill="#1a0a26" />

      <ellipse cx="700" cy="380" rx="80" ry="6" fill="#2a1242" opacity="0.6" />
      <ellipse cx="700" cy="380" rx="60" ry="4" fill="#f7b733" opacity="0.18" />

      <rect x="0" y="120" width="240" height="380" fill="#15082a" />
      <rect x="0" y="116" width="240" height="6" fill="#2a1242" />

      <rect x="38" y="158" width="20" height="26" fill="#1a0a26" />
      <rect x="42" y="162" width="12" height="18" fill="#f7b733" opacity="0.85" />
      <rect x="80" y="190" width="20" height="26" fill="#1a0a26" />
      <rect x="84" y="194" width="12" height="18" fill="#f7b733" opacity="0.75" />
      <rect x="38" y="240" width="20" height="26" fill="#1a0a26" />
      <rect x="42" y="244" width="12" height="18" fill="#f7b733" opacity="0.6" />
      <rect x="138" y="170" width="20" height="26" fill="#1a0a26" />
      <rect x="142" y="174" width="12" height="18" fill="#f7b733" opacity="0.9" />
      <rect x="138" y="225" width="20" height="26" fill="#1a0a26" />
      <rect x="180" y="200" width="20" height="26" fill="#1a0a26" />
      <rect x="184" y="204" width="12" height="18" fill="#c87156" opacity="0.7" />

      <rect x="50" y="282" width="38" height="50" fill="#3a1e4f" />
      <rect x="54" y="286" width="30" height="42" fill="#5a2868" />
      <circle cx="80" cy="308" r="1.5" fill="#f7b733" />

      <rect x="170" y="320" width="14" height="12" fill="#9b4f3a" />
      <ellipse cx="177" cy="318" rx="10" ry="4" fill="#3b8a5a" />
      <circle cx="172" cy="315" r="2" fill="#6dd3a0" />
      <circle cx="180" cy="316" r="2" fill="#6dd3a0" />

      <rect x="960" y="100" width="240" height="400" fill="#15082a" />
      <rect x="960" y="96" width="240" height="6" fill="#2a1242" />

      <rect x="990" y="142" width="22" height="28" fill="#1a0a26" />
      <rect x="994" y="146" width="14" height="20" fill="#f7b733" opacity="0.85" />
      <rect x="1030" y="170" width="22" height="28" fill="#1a0a26" />
      <rect x="1034" y="174" width="14" height="20" fill="#f7b733" opacity="0.7" />
      <rect x="1080" y="150" width="22" height="28" fill="#1a0a26" />
      <rect x="1084" y="154" width="14" height="20" fill="#c97874" opacity="0.8" />
      <rect x="1130" y="180" width="22" height="28" fill="#1a0a26" />
      <rect x="1134" y="184" width="14" height="20" fill="#f7b733" opacity="0.6" />
      <rect x="1030" y="230" width="22" height="28" fill="#1a0a26" />
      <rect x="1034" y="234" width="14" height="20" fill="#f7b733" opacity="0.55" />
      <rect x="1080" y="220" width="22" height="28" fill="#1a0a26" />

      <rect x="990" y="280" width="80" height="22" fill="#0a0410" />
      <rect x="990" y="280" width="80" height="22" fill="#f7b733" opacity="0.18" />
      <text
        x="1030"
        y="296"
        fontSize="11"
        fontFamily="monospace"
        fontWeight="700"
        textAnchor="middle"
        fill="#f7b733"
        opacity="0.85"
      >
        BANK
      </text>

      <rect x="528" y="200" width="4" height="140" fill="#3a1e4f" />
      <rect x="522" y="190" width="16" height="12" fill="#f7b733" />
      <rect x="524" y="192" width="12" height="8" fill="#ffe9a3" />
      <ellipse cx="530" cy="200" rx="180" ry="120" fill="url(#lamp)">
        <animate
          attributeName="rx"
          values="172;184;178;186;180"
          dur="1.2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="ry"
          values="116;124;120;125;120"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </ellipse>

      <polygon points="332,290 432,290 412,278 352,278" fill="#9b4f3a" />
      <rect x="332" y="290" width="100" height="6" fill="#c87156" />
      <rect x="338" y="296" width="88" height="22" fill="#c87156" />
      <rect x="338" y="296" width="88" height="3" fill="#e69074" />
      <rect x="342" y="318" width="4" height="20" fill="#3a1e4f" />
      <rect x="418" y="318" width="4" height="20" fill="#3a1e4f" />
      <ellipse cx="358" cy="294" rx="6" ry="3" fill="#1a0a26" />
      <rect x="354" y="290" width="8" height="5" fill="#1a0a26" />
      <rect x="376" y="291" width="4" height="5" fill="#f5f1ea" />
      <rect x="384" y="291" width="4" height="5" fill="#f5f1ea" />
      <rect x="392" y="291" width="4" height="5" fill="#f5f1ea" />
      <rect x="370" y="262" width="36" height="14" fill="#0a0410" />
      <text
        x="388"
        y="272"
        fontSize="9"
        fontFamily="monospace"
        fontWeight="700"
        textAnchor="middle"
        fill="#f7b733"
      >
        CHAI
      </text>
      <ellipse cx="358" cy="278" rx="6" ry="10" fill="url(#steam)">
        <animate
          attributeName="cy"
          values="278;258;278"
          dur="3.4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.8;0.1;0.8"
          dur="3.4s"
          repeatCount="indefinite"
        />
      </ellipse>

      <rect x="354" y="262" width="8" height="14" fill="#c87156" />
      <rect x="356" y="254" width="4" height="8" fill="#e7c69b" />
      <rect x="354" y="252" width="8" height="3" fill="#1a0a26" />

      <rect x="612" y="306" width="6" height="14" fill="#3a1e4f" />
      <rect x="613" y="298" width="4" height="8" fill="#e7c69b" />
      <rect x="612" y="296" width="6" height="3" fill="#1a0a26" />
      <rect x="611" y="320" width="2" height="6" fill="#1a0a26" />
      <rect x="617" y="320" width="2" height="6" fill="#1a0a26" />
      <rect x="619" y="312" width="5" height="6" fill="#c97874" />

      <rect x="752" y="302" width="8" height="20" fill="#c97874" />
      <rect x="754" y="294" width="4" height="8" fill="#e7c69b" />
      <rect x="752" y="292" width="8" height="3" fill="#1a0a26" />
      <rect x="752" y="322" width="3" height="4" fill="#1a0a26" />
      <rect x="757" y="322" width="3" height="4" fill="#1a0a26" />
      <rect x="764" y="312" width="4" height="10" fill="#6dd3a0" />
      <rect x="765" y="308" width="2" height="4" fill="#e7c69b" />

      <rect x="850" y="316" width="36" height="6" fill="#3a1e4f" />
      <circle cx="856" cy="328" r="6" fill="#1a0a26" />
      <circle cx="880" cy="328" r="6" fill="#1a0a26" />
      <circle cx="856" cy="328" r="2" fill="#6b3060" />
      <circle cx="880" cy="328" r="2" fill="#6b3060" />
      <rect x="852" y="306" width="3" height="12" fill="#3a1e4f" />
      <rect x="848" y="302" width="10" height="4" fill="#3a1e4f" />
      <rect x="862" y="310" width="14" height="6" fill="#c87156" />

      <ellipse cx="244" cy="332" rx="12" ry="4" fill="#0a0410" opacity="0.7" />
      <rect x="232" y="324" width="22" height="8" fill="#9b4f3a" />
      <rect x="252" y="322" width="6" height="6" fill="#9b4f3a" />
      <rect x="256" y="320" width="2" height="3" fill="#9b4f3a" />
      <rect x="234" y="332" width="2" height="4" fill="#9b4f3a" />
      <rect x="240" y="332" width="2" height="4" fill="#9b4f3a" />
      <rect x="246" y="332" width="2" height="4" fill="#9b4f3a" />
      <rect x="252" y="332" width="2" height="4" fill="#9b4f3a" />

      <g fill="#f7b733">
        <rect x="180" y="358" width="2" height="2" opacity="0.7">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite" />
        </rect>
        <rect x="420" y="364" width="2" height="2" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="4s" repeatCount="indefinite" />
        </rect>
        <rect x="660" y="358" width="2" height="2" opacity="0.5">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.6s" repeatCount="indefinite" />
        </rect>
        <rect x="900" y="364" width="2" height="2" opacity="0.7" />
        <rect x="540" y="350" width="2" height="2" opacity="0.5" />
      </g>
    </svg>
  );
}
