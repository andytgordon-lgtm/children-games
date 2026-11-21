/** Letters and Sounds (England) Phase 2 content */

export type Grapheme = {
  letter: string
  /** Spoken cue for TTS (pure phoneme where helpful) */
  sound: string
  set: 1 | 2 | 3 | 4 | 5
}

export type CvcWord = {
  word: string
  sounds: string[]
  set: 1 | 2 | 3 | 4 | 5
}

/** Phase 2 grapheme sets in teaching order */
export const PHASE2_GRAPHEMES: Grapheme[] = [
  { letter: 's', sound: 'sss', set: 1 },
  { letter: 'a', sound: 'a', set: 1 },
  { letter: 't', sound: 't', set: 1 },
  { letter: 'p', sound: 'p', set: 1 },
  { letter: 'i', sound: 'i', set: 2 },
  { letter: 'n', sound: 'n', set: 2 },
  { letter: 'm', sound: 'mmm', set: 2 },
  { letter: 'd', sound: 'd', set: 2 },
  { letter: 'g', sound: 'g', set: 3 },
  { letter: 'o', sound: 'o', set: 3 },
  { letter: 'c', sound: 'c', set: 3 },
  { letter: 'k', sound: 'k', set: 3 },
  { letter: 'ck', sound: 'ck', set: 4 },
  { letter: 'e', sound: 'e', set: 4 },
  { letter: 'u', sound: 'u', set: 4 },
  { letter: 'r', sound: 'rrr', set: 4 },
  { letter: 'h', sound: 'h', set: 5 },
  { letter: 'b', sound: 'b', set: 5 },
  { letter: 'f', sound: 'fff', set: 5 },
  { letter: 'ff', sound: 'fff', set: 5 },
  { letter: 'l', sound: 'lll', set: 5 },
  { letter: 'll', sound: 'lll', set: 5 },
  { letter: 'ss', sound: 'sss', set: 5 },
]

export const PHASE2_WORDS: CvcWord[] = [
  { word: 'sat', sounds: ['s', 'a', 't'], set: 1 },
  { word: 'pat', sounds: ['p', 'a', 't'], set: 1 },
  { word: 'tap', sounds: ['t', 'a', 'p'], set: 1 },
  { word: 'sap', sounds: ['s', 'a', 'p'], set: 1 },
  { word: 'pin', sounds: ['p', 'i', 'n'], set: 2 },
  { word: 'tin', sounds: ['t', 'i', 'n'], set: 2 },
  { word: 'nap', sounds: ['n', 'a', 'p'], set: 2 },
  { word: 'mat', sounds: ['m', 'a', 't'], set: 2 },
  { word: 'dip', sounds: ['d', 'i', 'p'], set: 2 },
  { word: 'mad', sounds: ['m', 'a', 'd'], set: 2 },
  { word: 'dig', sounds: ['d', 'i', 'g'], set: 3 },
  { word: 'dog', sounds: ['d', 'o', 'g'], set: 3 },
  { word: 'got', sounds: ['g', 'o', 't'], set: 3 },
  { word: 'top', sounds: ['t', 'o', 'p'], set: 3 },
  { word: 'cat', sounds: ['c', 'a', 't'], set: 3 },
  { word: 'kit', sounds: ['k', 'i', 't'], set: 3 },
  { word: 'pick', sounds: ['p', 'i', 'ck'], set: 4 },
  { word: 'sock', sounds: ['s', 'o', 'ck'], set: 4 },
  { word: 'neck', sounds: ['n', 'e', 'ck'], set: 4 },
  { word: 'mug', sounds: ['m', 'u', 'g'], set: 4 },
  { word: 'run', sounds: ['r', 'u', 'n'], set: 4 },
  { word: 'red', sounds: ['r', 'e', 'd'], set: 4 },
  { word: 'hat', sounds: ['h', 'a', 't'], set: 5 },
  { word: 'hop', sounds: ['h', 'o', 'p'], set: 5 },
  { word: 'big', sounds: ['b', 'i', 'g'], set: 5 },
  { word: 'bus', sounds: ['b', 'u', 's'], set: 5 },
  { word: 'fun', sounds: ['f', 'u', 'n'], set: 5 },
  { word: 'huff', sounds: ['h', 'u', 'ff'], set: 5 },
  { word: 'bell', sounds: ['b', 'e', 'll'], set: 5 },
  { word: 'miss', sounds: ['m', 'i', 'ss'], set: 5 },
]

/** Stars needed to unlock each set (set 1 always open) */
export const STARS_TO_UNLOCK_SET: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 0,
  2: 3,
  3: 8,
  4: 15,
  5: 24,
}

export function maxUnlockedSet(stars: number): 1 | 2 | 3 | 4 | 5 {
  let max: 1 | 2 | 3 | 4 | 5 = 1
  for (const set of [1, 2, 3, 4, 5] as const) {
    if (stars >= STARS_TO_UNLOCK_SET[set]) max = set
  }
  return max
}

export function graphemesUpTo(set: 1 | 2 | 3 | 4 | 5): Grapheme[] {
  return PHASE2_GRAPHEMES.filter((g) => g.set <= set)
}

export function wordsUpTo(set: 1 | 2 | 3 | 4 | 5): CvcWord[] {
  return PHASE2_WORDS.filter((w) => w.set <= set)
}

export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j]!, copy[i]!]
  }
  return copy
}
