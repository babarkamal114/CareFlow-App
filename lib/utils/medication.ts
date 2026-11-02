/** Fake network delay. */
export const wait = (ms = 200) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Deep copy, so callers can never mutate the fake database. */
export const copy = <T>(value: T): T => structuredClone(value);

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** "2026-10-19" -> local Date (avoids the UTC shift of new Date("2026-10-19")). */
export const parseLocal = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** Stable pseudo-random number in [0, 1) from a seed. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/** Pick an item from a list using a [0, 1) random number. */
export const pick = <T>(list: T[], r: number): T => list[Math.floor(r * 1000) % list.length];
