import type { ThemeId } from '../themes/themes'

export type CastRole = 'mum' | 'dad' | 'brother' | 'sister' | 'dog' | 'cat'

export type FamilyCast = Record<CastRole, string>

export type ChildProfile = {
  id: string
  name: string
  theme: ThemeId
  stars: number
  createdAt: string
}

export type AppState = {
  profiles: ChildProfile[]
  activeProfileId: string | null
  cast: FamilyCast
  musicEnabled: boolean
  sfxEnabled: boolean
}

const STORAGE_KEY = 'sound-world-v1'

export const DEFAULT_CAST: FamilyCast = {
  mum: 'Mum',
  dad: 'Dad',
  brother: 'Brother',
  sister: 'Sister',
  dog: 'Dog',
  cat: 'Cat',
}

export const CAST_ROLES: CastRole[] = ['mum', 'dad', 'brother', 'sister', 'dog', 'cat']

function uid(): string {
  return `child-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      profiles: Array.isArray(parsed.profiles) ? parsed.profiles : [],
      activeProfileId: parsed.activeProfileId ?? null,
      cast: { ...DEFAULT_CAST, ...(parsed.cast ?? {}) },
      musicEnabled: parsed.musicEnabled !== false,
      sfxEnabled: parsed.sfxEnabled !== false,
    }
  } catch {
    return emptyState()
  }
}

function emptyState(): AppState {
  return {
    profiles: [],
    activeProfileId: null,
    cast: { ...DEFAULT_CAST },
    musicEnabled: true,
    sfxEnabled: true,
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function createProfile(name: string, theme: ThemeId = 'trains'): ChildProfile {
  return {
    id: uid(),
    name: name.trim() || 'Explorer',
    theme,
    stars: 0,
    createdAt: new Date().toISOString(),
  }
}

export function getActiveProfile(state: AppState): ChildProfile | null {
  if (!state.activeProfileId) return null
  return state.profiles.find((p) => p.id === state.activeProfileId) ?? null
}

export function addStar(profile: ChildProfile, amount = 1): ChildProfile {
  return { ...profile, stars: profile.stars + amount }
}
