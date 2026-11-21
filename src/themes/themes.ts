export type ThemeId = 'trains' | 'planes' | 'dinosaurs' | 'farm' | 'space' | 'sea'

export type ThemeMeta = {
  id: ThemeId
  label: string
  emoji: string
  tagline: string
  countNoun: string
}

export const THEMES: ThemeMeta[] = [
  { id: 'trains', label: 'Trains', emoji: '🚂', tagline: 'Chug along with letter sounds', countNoun: 'carriages' },
  { id: 'planes', label: 'Planes', emoji: '✈️', tagline: 'Soar through phonics skies', countNoun: 'planes' },
  { id: 'dinosaurs', label: 'Dinosaurs', emoji: '🦕', tagline: 'Roar into reading', countNoun: 'dinos' },
  { id: 'farm', label: 'Farm', emoji: '🐑', tagline: 'Grow sounds on the farm', countNoun: 'animals' },
  { id: 'space', label: 'Space', emoji: '🚀', tagline: 'Blast off with letter sounds', countNoun: 'stars' },
  { id: 'sea', label: 'Under the sea', emoji: '🐠', tagline: 'Dive into phonics', countNoun: 'fish' },
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
