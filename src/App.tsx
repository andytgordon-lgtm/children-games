import { useEffect, useState } from 'react'
import {
  addStar,
  createProfile,
  getActiveProfile,
  loadState,
  saveState,
  type AppState,
  type CastRole,
} from './lib/profiles'
import { initSpeech } from './lib/speech'
import {
  setMusicEnabled,
  setSfxEnabled,
  setTheme as setAudioTheme,
  stopAudio,
  unlockAudio,
} from './lib/audio'
import { SoundMatch } from './games/SoundMatch'
import { BlendQuest } from './games/BlendQuest'
import { FamilyCount } from './games/FamilyCount'
import { Home, type GameId } from './pages/Home'
import { Onboarding } from './pages/Onboarding'
import { ParentSettings } from './pages/ParentSettings'
import type { ThemeId } from './themes/themes'

type Screen = 'home' | 'settings' | GameId

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [screen, setScreen] = useState<Screen>('home')

  const active = getActiveProfile(state)
  const theme: ThemeId = active?.theme ?? 'trains'

  useEffect(() => {
    initSpeech()
    const initial = loadState()
    setMusicEnabled(initial.musicEnabled)
    setSfxEnabled(initial.sfxEnabled)
    return () => stopAudio()
  }, [])

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    setAudioTheme(theme)
  }, [theme])

  useEffect(() => {
    setMusicEnabled(state.musicEnabled)
  }, [state.musicEnabled])

  useEffect(() => {
    setSfxEnabled(state.sfxEnabled)
  }, [state.sfxEnabled])

  const unlock = () => {
    void unlockAudio(theme)
  }

  const updateActive = (updater: (p: NonNullable<typeof active>) => NonNullable<typeof active>) => {
    setState((prev) => {
      const current = getActiveProfile(prev)
      if (!current) return prev
      return {
        ...prev,
        profiles: prev.profiles.map((p) => (p.id === current.id ? updater(p) : p)),
      }
    })
  }

  const awardStar = () => updateActive((p) => addStar(p))

  if (!active) {
    return (
      <div
        className="app-shell"
        onPointerDownCapture={unlock}
      >
        <Onboarding
          onStart={(name, chosenTheme) => {
            void unlockAudio(chosenTheme)
            const profile = createProfile(name, chosenTheme)
            setState((prev) => ({
              ...prev,
              profiles: [...prev.profiles, profile],
              activeProfileId: profile.id,
            }))
            setScreen('home')
          }}
        />
      </div>
    )
  }

  return (
    <div className="app-shell" onPointerDownCapture={unlock}>
      {screen === 'home' && (
        <Home
          profile={active}
          cast={state.cast}
          musicEnabled={state.musicEnabled}
          onPlay={(game) => {
            void unlockAudio(theme)
            setScreen(game)
          }}
          onTheme={(t) => {
            void unlockAudio(t)
            updateActive((p) => ({ ...p, theme: t }))
          }}
          onToggleMusic={() => {
            void unlockAudio(theme)
            setState((prev) => ({ ...prev, musicEnabled: !prev.musicEnabled }))
          }}
          onOpenSettings={() => setScreen('settings')}
          onSwitchProfile={() => setScreen('settings')}
        />
      )}

      {screen === 'settings' && (
        <ParentSettings
          cast={state.cast}
          profiles={state.profiles}
          activeId={state.activeProfileId}
          musicEnabled={state.musicEnabled}
          sfxEnabled={state.sfxEnabled}
          onCastChange={(role: CastRole, name: string) =>
            setState((prev) => ({ ...prev, cast: { ...prev.cast, [role]: name } }))
          }
          onSelectProfile={(id) => {
            setState((prev) => ({ ...prev, activeProfileId: id }))
            setScreen('home')
          }}
          onAddProfile={(name) => {
            const profile = createProfile(name, theme)
            setState((prev) => ({
              ...prev,
              profiles: [...prev.profiles, profile],
              activeProfileId: profile.id,
            }))
          }}
          onRenameProfile={(id, name) =>
            setState((prev) => ({
              ...prev,
              profiles: prev.profiles.map((p) => (p.id === id ? { ...p, name: name || p.name } : p)),
            }))
          }
          onMusicEnabled={(enabled) => {
            void unlockAudio(theme)
            setState((prev) => ({ ...prev, musicEnabled: enabled }))
          }}
          onSfxEnabled={(enabled) => {
            void unlockAudio(theme)
            setState((prev) => ({ ...prev, sfxEnabled: enabled }))
          }}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'sound-match' && (
        <SoundMatch
          stars={active.stars}
          cast={state.cast}
          onStar={awardStar}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'blend-quest' && (
        <BlendQuest
          stars={active.stars}
          cast={state.cast}
          onStar={awardStar}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'family-count' && (
        <FamilyCount
          stars={active.stars}
          theme={active.theme}
          cast={state.cast}
          onStar={awardStar}
          onBack={() => setScreen('home')}
        />
      )}
    </div>
  )
}
