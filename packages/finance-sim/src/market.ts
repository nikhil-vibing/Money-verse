export interface MarketTickParams {
  readonly prevPrice: number;
  readonly volatility: number;
  readonly drift: number;
  readonly rng: () => number;
}

/**
 * One-day geometric Brownian motion tick. Deterministic given `rng`.
 */
export function marketDayTick({
  prevPrice,
  volatility,
  drift,
  rng,
}: MarketTickParams): number {
  if (prevPrice < 0 || volatility < 0) {
    throw new RangeError("marketDayTick: invalid inputs");
  }
  const u = rng();
  const v = rng();
  const z = Math.sqrt(-2 * Math.log(Math.max(u, 1e-12))) * Math.cos(2 * Math.PI * v);
  const dailyDrift = drift / 252 - (volatility * volatility) / 2 / 252;
  const dailyDiffusion = volatility * Math.sqrt(1 / 252) * z;
  return prevPrice * Math.exp(dailyDrift + dailyDiffusion);
}

/**
 * Tiny mulberry32 PRNG — for deterministic seeded testing.
 */
export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
