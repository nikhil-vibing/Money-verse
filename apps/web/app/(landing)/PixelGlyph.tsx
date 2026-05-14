import type { ReactElement } from "react";

type GlyphName =
  | "chawl-mohalla"
  | "bank-bazaar"
  | "karyalaya-park"
  | "niveshak-chowk"
  | "rakshak-lane"
  | "vyapaar-mandi"
  | "bhavishya-ghat"
  | "mentor"
  | "broker"
  | "student";

interface PixelGlyphProps {
  name: GlyphName;
  size?: number;
  className?: string;
}

export function PixelGlyph({ name, size = 32, className }: PixelGlyphProps) {
  const renderer = GLYPHS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden
    >
      {renderer()}
    </svg>
  );
}

const C = {
  ink: "#1a0a26",
  shade: "#2a1242",
  base: "#3a1e4f",
  warm: "#c87156",
  warmLight: "#e69074",
  saffron: "#f7b733",
  cream: "#f5f1ea",
  mint: "#6dd3a0",
  rose: "#c97874",
  skin: "#e7c69b",
};

const GLYPHS: Record<GlyphName, () => ReactElement> = {
  "chawl-mohalla": () => (
    <g>
      <rect x="1" y="6" width="6" height="9" fill={C.warm} />
      <rect x="9" y="5" width="6" height="10" fill={C.warm} />
      <polygon points="0,7 4,3 8,7" fill={C.warmLight} />
      <polygon points="8,6 12,2 16,6" fill={C.warmLight} />
      <rect x="2" y="9" width="2" height="2" fill={C.saffron} />
      <rect x="5" y="9" width="1" height="2" fill={C.saffron} />
      <rect x="10" y="8" width="2" height="2" fill={C.saffron} />
      <rect x="13" y="8" width="1" height="2" fill={C.saffron} />
      <rect x="3" y="12" width="2" height="3" fill={C.ink} />
      <rect x="11" y="12" width="2" height="3" fill={C.ink} />
    </g>
  ),
  "bank-bazaar": () => (
    <g>
      <polygon points="1,5 8,1 15,5" fill={C.cream} />
      <rect x="1" y="5" width="14" height="1" fill={C.ink} />
      <rect x="2" y="6" width="2" height="7" fill={C.cream} />
      <rect x="5" y="6" width="2" height="7" fill={C.cream} />
      <rect x="9" y="6" width="2" height="7" fill={C.cream} />
      <rect x="12" y="6" width="2" height="7" fill={C.cream} />
      <rect x="0" y="13" width="16" height="2" fill={C.ink} />
      <rect x="7" y="8" width="2" height="2" fill={C.saffron} />
    </g>
  ),
  "karyalaya-park": () => (
    <g>
      <rect x="2" y="2" width="12" height="13" fill={C.shade} />
      <rect x="3" y="3" width="2" height="2" fill={C.saffron} />
      <rect x="6" y="3" width="2" height="2" fill={C.saffron} />
      <rect x="9" y="3" width="2" height="2" fill={C.cream} />
      <rect x="12" y="3" width="2" height="2" fill={C.saffron} />
      <rect x="3" y="6" width="2" height="2" fill={C.cream} />
      <rect x="6" y="6" width="2" height="2" fill={C.saffron} />
      <rect x="9" y="6" width="2" height="2" fill={C.saffron} />
      <rect x="12" y="6" width="2" height="2" fill={C.cream} />
      <rect x="3" y="9" width="2" height="2" fill={C.saffron} />
      <rect x="6" y="9" width="2" height="2" fill={C.saffron} />
      <rect x="9" y="9" width="2" height="2" fill={C.cream} />
      <rect x="12" y="9" width="2" height="2" fill={C.saffron} />
      <rect x="7" y="12" width="2" height="3" fill={C.ink} />
    </g>
  ),
  "niveshak-chowk": () => (
    <g>
      <rect x="1" y="11" width="2" height="4" fill={C.rose} />
      <rect x="4" y="8" width="2" height="7" fill={C.saffron} />
      <rect x="7" y="9" width="2" height="6" fill={C.mint} />
      <rect x="10" y="5" width="2" height="10" fill={C.saffron} />
      <rect x="13" y="3" width="2" height="12" fill={C.mint} />
      <polyline
        points="2,11 5,8 8,9 11,5 14,3"
        fill="none"
        stroke={C.cream}
        strokeWidth="0.6"
        opacity="0.7"
      />
    </g>
  ),
  "rakshak-lane": () => (
    <g>
      <polygon
        points="8,1 14,3 14,8 8,15 2,8 2,3"
        fill={C.warm}
      />
      <polygon
        points="8,3 12,4 12,8 8,13 4,8 4,4"
        fill={C.warmLight}
      />
      <rect x="7" y="6" width="2" height="4" fill={C.saffron} />
      <rect x="6" y="7" width="4" height="2" fill={C.saffron} />
    </g>
  ),
  "vyapaar-mandi": () => (
    <g>
      <polygon points="1,5 15,5 13,2 3,2" fill={C.warm} />
      <rect x="1" y="5" width="14" height="2" fill={C.warmLight} />
      <rect x="1" y="7" width="14" height="6" fill={C.shade} />
      <rect x="2" y="8" width="3" height="3" fill={C.saffron} />
      <rect x="6" y="8" width="3" height="3" fill={C.cream} />
      <rect x="10" y="8" width="3" height="3" fill={C.mint} />
      <rect x="0" y="13" width="16" height="2" fill={C.ink} />
    </g>
  ),
  "bhavishya-ghat": () => (
    <g>
      <rect x="0" y="11" width="16" height="4" fill={C.shade} />
      <rect x="0" y="11" width="16" height="1" fill={C.cream} opacity="0.4" />
      <rect x="0" y="13" width="16" height="1" fill={C.cream} opacity="0.2" />
      <polygon points="2,11 14,11 12,8 4,8" fill={C.warm} />
      <rect x="7" y="3" width="2" height="5" fill={C.ink} />
      <polygon points="7,3 7,6 11,4" fill={C.cream} />
    </g>
  ),
  mentor: () => (
    <g>
      <rect x="6" y="3" width="4" height="4" fill={C.skin} />
      <rect x="5" y="2" width="6" height="2" fill={C.ink} />
      <rect x="7" y="5" width="1" height="1" fill={C.ink} />
      <rect x="9" y="5" width="1" height="1" fill={C.ink} />
      <rect x="5" y="7" width="6" height="6" fill={C.rose} />
      <rect x="5" y="7" width="6" height="1" fill={C.cream} opacity="0.6" />
      <rect x="4" y="9" width="1" height="4" fill={C.rose} />
      <rect x="11" y="9" width="1" height="4" fill={C.rose} />
      <rect x="5" y="13" width="2" height="2" fill={C.ink} />
      <rect x="9" y="13" width="2" height="2" fill={C.ink} />
    </g>
  ),
  broker: () => (
    <g>
      <rect x="6" y="3" width="4" height="4" fill={C.skin} />
      <rect x="5" y="2" width="6" height="2" fill={C.shade} />
      <rect x="7" y="5" width="1" height="1" fill={C.ink} />
      <rect x="9" y="5" width="1" height="1" fill={C.ink} />
      <rect x="5" y="7" width="6" height="6" fill={C.shade} />
      <rect x="7" y="7" width="2" height="6" fill={C.cream} />
      <rect x="5" y="13" width="2" height="2" fill={C.ink} />
      <rect x="9" y="13" width="2" height="2" fill={C.ink} />
    </g>
  ),
  student: () => (
    <g>
      <rect x="6" y="3" width="4" height="4" fill={C.skin} />
      <rect x="5" y="1" width="6" height="2" fill={C.ink} />
      <rect x="4" y="2" width="8" height="1" fill={C.ink} />
      <rect x="7" y="5" width="1" height="1" fill={C.ink} />
      <rect x="9" y="5" width="1" height="1" fill={C.ink} />
      <rect x="5" y="7" width="6" height="6" fill={C.mint} />
      <rect x="5" y="13" width="2" height="2" fill={C.ink} />
      <rect x="9" y="13" width="2" height="2" fill={C.ink} />
    </g>
  ),
};
