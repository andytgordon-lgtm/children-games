import {
  graphemesUpTo,
  maxUnlockedSet,
  nextSet,
  setTitle,
  STARS_TO_UNLOCK_SET,
  wordsUpTo,
  type SetId,
} from './phonics'

export type CoachReport = {
  headline: string
  tips: string[]
  practiceWords: string[]
  nextLabel: string
  openSets: SetId[]
}

/** Tips from stars already stored on this device. No chat, and no network call. */
export function coachReport(name: string, stars: number): CoachReport {
  const set = maxUnlockedSet(stars)
  const currentLetters = graphemesUpTo(set).filter((grapheme) => grapheme.set === set)
  const currentWords = wordsUpTo(set).filter((word) => word.set === set)
  const upcoming = nextSet(set)
  const letterList = currentLetters
    .slice(0, 4)
    .map((grapheme) => grapheme.letter)
    .join(', ')
  const practiceWords = (currentWords.length > 0 ? currentWords : wordsUpTo(set)).slice(0, 4).map((word) => word.word)

  const tips = [
    `${name} can play every sound in ${setTitle(set)}.`,
    letterList ? `Say ${letterList} a few times, then tap the matching letters.` : 'Start with s, a, t, and p.',
    upcoming
      ? `${setTitle(upcoming)} opens at ${STARS_TO_UNLOCK_SET[upcoming]} stars.`
      : 'Every sound set in the app is open.',
  ]

  return {
    headline: `${name} has ${stars} ${stars === 1 ? 'star' : 'stars'}`,
    tips,
    practiceWords: practiceWords.length > 0 ? practiceWords : ['sat', 'pat', 'tap'],
    nextLabel: upcoming ? `${setTitle(upcoming)} · ${STARS_TO_UNLOCK_SET[upcoming]}★` : 'All sets open',
    openSets: Array.from({ length: set }, (_, index) => (index + 1) as SetId),
  }
}
