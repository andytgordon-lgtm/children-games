/** Letters and Sounds (England): Phase 2 sets, Phase 3 digraphs, then a few Phase 5 spellings. */

export type SetId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export const SETS: SetId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export type Grapheme = {
  letter: string
  /** Pure-sound cue respelled for the device voice, e.g. 'sss' not the letter name */
  sound: string
  /** Model word the sound is heard in */
  key: string
  set: SetId
}

export type CvcWord = {
  word: string
  sounds: string[]
  set: SetId
}

/** Pure-sound respellings for graphemes as they appear inside words (Blend Quest) */
const PHONEME_CUE: Record<string, string> = {
  s: 'sss',
  a: 'ah',
  t: 'tuh',
  p: 'puh',
  i: 'ih',
  n: 'nnn',
  m: 'mmm',
  d: 'duh',
  g: 'guh',
  o: 'oh',
  c: 'cuh',
  k: 'kuh',
  e: 'eh',
  u: 'uh',
  r: 'rrr',
  h: 'huh',
  b: 'buh',
  f: 'fff',
  l: 'lll',
  sh: 'sh',
  ch: 'ch',
  th: 'th',
  ng: 'ng',
  ai: 'ay',
  ee: 'ee',
  igh: 'eye',
  oa: 'oh',
  ar: 'ar',
  or: 'or',
  ur: 'ur',
  ow: 'ow',
  oi: 'oy',
  ay: 'ay',
  'a-e': 'ay',
  ea: 'ee',
  oy: 'oy',
}

/** The cue spoken for a grapheme inside a word, e.g. blending 's a t' */
export function phonemeCue(grapheme: string): string {
  return PHONEME_CUE[grapheme] ?? grapheme
}

/** Phase 2 grapheme sets in teaching order. Sounds are pure sounds, never letter names. */
export const PHASE2_GRAPHEMES: Grapheme[] = [
  { letter: 's', sound: 'sss', key: 'sun', set: 1 },
  { letter: 'a', sound: 'ah', key: 'ant', set: 1 },
  { letter: 't', sound: 'tuh', key: 'tap', set: 1 },
  { letter: 'p', sound: 'puh', key: 'pen', set: 1 },
  { letter: 'i', sound: 'ih', key: 'ink', set: 2 },
  { letter: 'n', sound: 'nnn', key: 'net', set: 2 },
  { letter: 'm', sound: 'mmm', key: 'mop', set: 2 },
  { letter: 'd', sound: 'duh', key: 'dog', set: 2 },
  { letter: 'g', sound: 'guh', key: 'got', set: 3 },
  { letter: 'o', sound: 'oh', key: 'ox', set: 3 },
  { letter: 'c', sound: 'cuh', key: 'cat', set: 3 },
  { letter: 'k', sound: 'kuh', key: 'kit', set: 3 },
  { letter: 'ck', sound: 'kuh', key: 'sock', set: 4 },
  { letter: 'e', sound: 'eh', key: 'egg', set: 4 },
  { letter: 'u', sound: 'uh', key: 'up', set: 4 },
  { letter: 'r', sound: 'rrr', key: 'run', set: 4 },
  { letter: 'h', sound: 'huh', key: 'hat', set: 5 },
  { letter: 'b', sound: 'buh', key: 'bug', set: 5 },
  { letter: 'f', sound: 'fff', key: 'frog', set: 5 },
  { letter: 'ff', sound: 'fff', key: 'huff', set: 5 },
  { letter: 'l', sound: 'lll', key: 'leg', set: 5 },
  { letter: 'll', sound: 'lll', key: 'bell', set: 5 },
  { letter: 'ss', sound: 'sss', key: 'miss', set: 5 },
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
  { word: 'shop', sounds: ['sh', 'o', 'p'], set: 6 },
  { word: 'ship', sounds: ['sh', 'i', 'p'], set: 6 },
  { word: 'fish', sounds: ['f', 'i', 'sh'], set: 6 },
  { word: 'chop', sounds: ['ch', 'o', 'p'], set: 6 },
  { word: 'chat', sounds: ['ch', 'a', 't'], set: 6 },
  { word: 'thin', sounds: ['th', 'i', 'n'], set: 6 },
  { word: 'moth', sounds: ['m', 'o', 'th'], set: 6 },
  { word: 'song', sounds: ['s', 'o', 'ng'], set: 6 },
  { word: 'ring', sounds: ['r', 'i', 'ng'], set: 6 },
  { word: 'rain', sounds: ['r', 'ai', 'n'], set: 7 },
  { word: 'tail', sounds: ['t', 'ai', 'l'], set: 7 },
  { word: 'see', sounds: ['s', 'ee'], set: 7 },
  { word: 'feet', sounds: ['f', 'ee', 't'], set: 7 },
  { word: 'night', sounds: ['n', 'igh', 't'], set: 7 },
  { word: 'light', sounds: ['l', 'igh', 't'], set: 7 },
  { word: 'boat', sounds: ['b', 'oa', 't'], set: 7 },
  { word: 'goat', sounds: ['g', 'oa', 't'], set: 7 },
  { word: 'park', sounds: ['p', 'ar', 'k'], set: 8 },
  { word: 'farm', sounds: ['f', 'ar', 'm'], set: 8 },
  { word: 'fork', sounds: ['f', 'or', 'k'], set: 8 },
  { word: 'corn', sounds: ['c', 'or', 'n'], set: 8 },
  { word: 'burn', sounds: ['b', 'ur', 'n'], set: 8 },
  { word: 'cow', sounds: ['c', 'ow'], set: 8 },
  { word: 'down', sounds: ['d', 'ow', 'n'], set: 8 },
  { word: 'coin', sounds: ['c', 'oi', 'n'], set: 8 },
  { word: 'day', sounds: ['d', 'ay'], set: 9 },
  { word: 'play', sounds: ['p', 'l', 'ay'], set: 9 },
  { word: 'make', sounds: ['m', 'a-e', 'k'], set: 9 },
  { word: 'cake', sounds: ['c', 'a-e', 'k'], set: 9 },
  { word: 'sea', sounds: ['s', 'ea'], set: 9 },
  { word: 'seat', sounds: ['s', 'ea', 't'], set: 9 },
  { word: 'boy', sounds: ['b', 'oy'], set: 9 },
  { word: 'toy', sounds: ['t', 'oy'], set: 9 },
]

const PHASE3_GRAPHEMES: Grapheme[] = [
  { letter: 'sh', sound: 'sh', key: 'shop', set: 6 },
  { letter: 'ch', sound: 'ch', key: 'chop', set: 6 },
  { letter: 'th', sound: 'th', key: 'thin', set: 6 },
  { letter: 'ng', sound: 'ng', key: 'ring', set: 6 },
  { letter: 'ai', sound: 'ay', key: 'rain', set: 7 },
  { letter: 'ee', sound: 'ee', key: 'feet', set: 7 },
  { letter: 'igh', sound: 'eye', key: 'light', set: 7 },
  { letter: 'oa', sound: 'oh', key: 'boat', set: 7 },
  { letter: 'ar', sound: 'ar', key: 'park', set: 8 },
  { letter: 'or', sound: 'or', key: 'fork', set: 8 },
  { letter: 'ur', sound: 'ur', key: 'burn', set: 8 },
  { letter: 'ow', sound: 'ow', key: 'cow', set: 8 },
  { letter: 'oi', sound: 'oy', key: 'coin', set: 8 },
]

const PHASE5_GRAPHEMES: Grapheme[] = [
  { letter: 'ay', sound: 'ay', key: 'day', set: 9 },
  { letter: 'a-e', sound: 'ay', key: 'cake', set: 9 },
  { letter: 'ea', sound: 'ee', key: 'sea', set: 9 },
  { letter: 'oy', sound: 'oy', key: 'toy', set: 9 },
]

export const ALL_GRAPHEMES: Grapheme[] = [...PHASE2_GRAPHEMES, ...PHASE3_GRAPHEMES, ...PHASE5_GRAPHEMES]

/** Stars needed to unlock each set (set 1 always open) */
export const STARS_TO_UNLOCK_SET: Record<SetId, number> = {
  1: 0,
  2: 3,
  3: 8,
  4: 15,
  5: 24,
  6: 36,
  7: 50,
  8: 66,
  9: 84,
}

export function setTitle(set: SetId): string {
  switch (set) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return `Set ${set}`
    case 6:
      return 'sh ch th ng'
    case 7:
      return 'ai ee igh oa'
    case 8:
      return 'ar or ur ow oi'
    case 9:
      return 'ay a-e ea oy'
  }
}

export function maxUnlockedSet(stars: number): SetId {
  let max: SetId = 1
  for (const set of SETS) {
    if (stars >= STARS_TO_UNLOCK_SET[set]) max = set
  }
  return max
}

export function nextSet(set: SetId): SetId | null {
  if (set === 9) return null
  return (set + 1) as SetId
}

export function countCeiling(stars: number): 10 | 20 {
  return maxUnlockedSet(stars) >= 6 ? 20 : 10
}

export function graphemesUpTo(set: SetId): Grapheme[] {
  return ALL_GRAPHEMES.filter((g) => g.set <= set)
}

export function wordsUpTo(set: SetId): CvcWord[] {
  return PHASE2_WORDS.filter((w) => w.set <= set)
}

export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]!] = [copy[j]!, copy[i]!]
  }
  return copy
}
