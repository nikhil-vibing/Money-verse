export type PerfTier = "high" | "medium" | "low";

export function detectPerfTier(): PerfTier {
  if (typeof window === "undefined") return "medium";
  const cores = navigator.hardwareConcurrency ?? 4;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) return "low";
  if (isMobile && cores <= 4) return "low";
  if (isMobile) return "medium";
  if (cores >= 8) return "high";
  return "medium";
}
