export type ThemeId = 'trains' | 'planes' | 'dinosaurs' | 'farm'

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
}
