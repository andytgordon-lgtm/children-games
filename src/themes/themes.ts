export type ThemeId = 'trains' | 'planes' | 'dinosaurs' | 'farm' | 'space' | 'sea'

export type ThemeMeta = {
  id: ThemeId
  label: string
  emoji: string
  tagline: string
  countNoun: string
  /** CSS gradient preview of the world's sky, used on world tiles */
  sky: string
}

export const THEMES: ThemeMeta[] = [
  { id: 'trains', label: 'Trains', emoji: '🚂', tagline: 'Chug along with letter sounds', countNoun: 'carriages', sky: 'linear-gradient(180deg, #9fd4f0, #e8f4c8)' },
  { id: 'planes', label: 'Planes', emoji: '✈️', tagline: 'Soar through phonics skies', countNoun: 'planes', sky: 'linear-gradient(180deg, #6eb6e8, #f0f6ff)' },
  { id: 'dinosaurs', label: 'Dinosaurs', emoji: '🦕', tagline: 'Roar into reading', countNoun: 'dinos', sky: 'linear-gradient(180deg, #7bb86a, #efe2b8)' },
  { id: 'farm', label: 'Farm', emoji: '🐑', tagline: 'Grow sounds on the farm', countNoun: 'animals', sky: 'linear-gradient(180deg, #8bc46a, #f3e4b8)' },
  { id: 'space', label: 'Space', emoji: '🚀', tagline: 'Blast off with letter sounds', countNoun: 'stars', sky: 'linear-gradient(180deg, #9db0e8, #f7e7c2)' },
  { id: 'sea', label: 'Under the sea', emoji: '🐠', tagline: 'Dive into phonics', countNoun: 'fish', sky: 'linear-gradient(180deg, #127a96, #e7f6c8)' },
]

export function getTheme(id: ThemeId): ThemeMeta {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]!
}

/** Simple SVG-friendly count item glyphs per theme */
export const THEME_COUNT_GLYPHS: Record<ThemeId, string[]> = {
  trains: ['🚂', '🚃', '🛤️', '🔔', '🎒'],
  planes: ['✈️', '🛩️', '☁️', '🛫', '🧳'],
  dinosaurs: ['🦕', '🦖', '🥚', '🦴', '🌿'],
  farm: ['🐑', '🐄', '🐷', '🐔', '🌽'],
  space: ['🚀', '🌟', '🪐', '👽', '🌙'],
  sea: ['🐠', '🐙', '🐚', '🦀', '⚓'],
}

export const THEME_COSTUME: Record<ThemeId, { person: string; pet: string }> = {
  trains: { person: '🧢', pet: '🎀' },
  planes: { person: '🧣', pet: '🎀' },
  dinosaurs: { person: '🎩', pet: '🦴' },
  farm: { person: '👒', pet: '🎀' },
  space: { person: '🧑‍🚀', pet: '⭐' },
  sea: { person: '🤿', pet: '🐚' },
}
