interface NetworkInformation {
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

export function hasWebGL2(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function isFastNetwork(): boolean {
  if (typeof navigator === "undefined") return true;
  const nav = navigator as NavigatorWithConnection;
  const conn = nav.connection;
  if (!conn) return true;
  if (conn.saveData) return false;
  const t = conn.effectiveType;
  return t !== "2g" && t !== "slow-2g";
}

export function hasEnoughCores(): boolean {
  if (typeof navigator === "undefined") return true;
  const n = navigator.hardwareConcurrency ?? 4;
  return n >= 4;
}

export function canRender3D(): boolean {
  return (
    hasWebGL2() &&
    !prefersReducedMotion() &&
    isFastNetwork() &&
    hasEnoughCores()
  );
}
