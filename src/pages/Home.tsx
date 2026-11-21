import { countCeiling, maxUnlockedSet, SETS, setTitle, STARS_TO_UNLOCK_SET } from '../lib/phonics'
import type { ChildProfile, FamilyCast } from '../lib/profiles'
import type { MediaUrls } from '../lib/useFamilyMedia'
import { getTheme, THEMES, type ThemeId } from '../themes/themes'
import { FamilyCastRow } from '../components/FamilyCast'

export type GameId = 'sound-match' | 'blend-quest' | 'family-count'

type Props = {
  profile: ChildProfile
  cast: FamilyCast
  photos?: MediaUrls
  cartoons?: MediaUrls
  musicEnabled: boolean
  onPlay: (game: GameId) => void
  onTheme: (theme: ThemeId) => void
  onToggleMusic: () => void
  onOpenSettings: () => void
  onSwitchProfile: () => void
}

export function Home({
  profile,
  cast,
  photos,
  cartoons,
  musicEnabled,
  onPlay,
  onTheme,
  onToggleMusic,
  onOpenSettings,
  onSwitchProfile,
}: Props) {
  const theme = getTheme(profile.theme)
  const unlocked = maxUnlockedSet(profile.stars)
  const ceiling = countCeiling(profile.stars)

  return (
    <section className="enter stack-gap">
      <header>
        <p style={{ margin: 0, fontWeight: 800, color: 'var(--muted)', fontSize: '0.95rem' }}>
          Playing as {profile.name}
        </p>
        <h1 className="brand brand-hero">Sound World</h1>
        <p className="lede">
          {theme.emoji} {theme.tagline}
        </p>
      </header>

      <FamilyCastRow
        cast={cast}
        theme={profile.theme}
        photos={photos}
        cartoons={cartoons}
        highlight={['mum', 'dad', 'brother', 'sister']}
      />

      <div className="row-actions">
        <div className="stars-pill">★ {profile.stars} stars</div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onToggleMusic}
          aria-pressed={musicEnabled}
          aria-label={musicEnabled ? 'Mute music' : 'Unmute music'}
          title={musicEnabled ? 'Mute music' : 'Unmute music'}
        >
          {musicEnabled ? 'Music on' : 'Music off'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onOpenSettings}>
          Parent settings
        </button>
        <button type="button" className="btn btn-ghost" onClick={onSwitchProfile}>
          Switch child
        </button>
      </div>

      <div className="panel">
        <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>Pick a world</strong>
        <div className="theme-picker" style={{ marginTop: '0.75rem' }}>
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`theme-chip ${profile.theme === t.id ? 'is-selected' : ''}`}
              onClick={() => onTheme(t.id)}
            >
              <span style={{ fontSize: '1.5rem' }}>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <nav className="game-nav" aria-label="Games">
        <button type="button" className="game-card-btn" onClick={() => onPlay('sound-match')}>
          <strong>Sound Match</strong>
          <span>Hear a sound → tap the letter</span>
        </button>
        <button type="button" className="game-card-btn" onClick={() => onPlay('blend-quest')}>
          <strong>Blend Quest</strong>
          <span>Sound out, then blend the word</span>
        </button>
        <button type="button" className="game-card-btn" onClick={() => onPlay('family-count')}>
          <strong>Family Count</strong>
          <span>
            Count 1–{ceiling} in your {theme.label.toLowerCase()} world
          </span>
        </button>
      </nav>

      <div className="panel">
        <strong style={{ fontFamily: 'var(--font-display)' }}>Letters and Sounds progress</strong>
        <div className="progress-strip" aria-label="Unlocked sound sets">
          {SETS.map((set) => (
            <span
              key={set}
              className={`progress-chip ${set <= unlocked ? 'is-open' : ''}`}
              title={
                set <= unlocked
                  ? `Set ${set} unlocked`
                  : `Set ${set} opens at ${STARS_TO_UNLOCK_SET[set]} stars`
              }
            >
              {setTitle(set)}
              {set <= unlocked ? ' ✓' : ` · ${STARS_TO_UNLOCK_SET[set]}★`}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
