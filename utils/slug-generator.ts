// utils/slug.ts

const ADJECTIVES = [
  "swift", "brave", "calm", "bright", "bold", "clever", "cosmic", "crimson",
  "daring", "eager", "fancy", "fierce", "gentle", "golden", "grand", "happy",
  "humble", "jolly", "kind", "lively", "lucky", "mighty", "noble", "peaceful",
  "proud", "quick", "quiet", "rapid", "royal", "sharp", "shiny", "silent",
  "sleek", "smooth", "snowy", "solid", "spicy", "sturdy", "sunny", "super",
  "tidy", "vivid", "warm", "wild", "wise", "witty", "zesty",
];

const NOUNS = [
  "king", "queen", "fox", "wolf", "bear", "lion", "tiger", "eagle",
  "hawk", "owl", "otter", "panda", "koala", "lemur", "lynx", "raven",
  "robin", "swan", "crane", "heron", "falcon", "dolphin", "whale", "shark",
  "turtle", "gecko", "cobra", "viper", "jaguar", "panther", "leopard", "cheetah",
  "rhino", "hippo", "zebra", "bison", "moose", "elk", "yak", "ibex",
  "comet", "nova", "orbit", "rocket", "meteor", "photon", "quasar", "nebula",
  "cedar", "maple", "willow", "birch", "oak", "pine", "aspen", "juniper",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a random two-word slug like "swift-fox" or "brave-otter".
 *
 * @param options.wordCount   Number of words to join (default 2)
 * @param options.separator   Separator between words (default "-")
 * @param options.suffix      Optional suffix to append (e.g. a short random id)
 */
export function generateRandomSlug(options?: {
  wordCount?: 2 | 3;
  separator?: string;
  suffix?: string;
}): string {
  const { wordCount = 2, separator = "-", suffix } = options ?? {};

  const words: string[] = [pick(ADJECTIVES), pick(NOUNS)];

  if (wordCount === 3) {
    words.push(pick(NOUNS));
  }

  const base = words.join(separator);
  return suffix ? `${base}${separator}${suffix}` : base;
}

/**
 * Generates a short random alphanumeric suffix, e.g. "a7f3".
 * Useful for guaranteeing uniqueness on collisions.
 */
export function randomSuffix(length = 4): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}