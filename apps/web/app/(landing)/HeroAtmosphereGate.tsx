"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { canRender3D } from "../../lib/capability";

const HeroAtmosphere = dynamic(
  () => import("./HeroAtmosphere").then((m) => m.HeroAtmosphere),
  { ssr: false },
);

export function HeroAtmosphereGate() {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (!canRender3D()) return;
    const idle = (cb: () => void) => {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      };
      if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 1500 });
      else window.setTimeout(cb, 800);
    };
    idle(() => setMount(true));
  }, []);

  if (!mount) return null;
  return <HeroAtmosphere />;
}
