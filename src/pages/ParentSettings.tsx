import { useRef, useState } from 'react'
import { coachReport } from '../lib/coach'
import { cartoonFromPhoto, compressPhoto, deleteRoleMedia, loadPhoto, saveCartoon, savePhoto } from '../lib/media'
import { maxUnlockedSet, setTitle } from '../lib/phonics'
import type { CastRole, ChildProfile, FamilyCast } from '../lib/profiles'
import { CAST_ROLES, isPet, ROLE_GLYPH } from '../lib/profiles'
import type { MediaUrls } from '../lib/useFamilyMedia'
import { THEME_COSTUME, type ThemeId } from '../themes/themes'

type Props = {
  cast: FamilyCast
  profiles: ChildProfile[]
  activeId: string | null
  theme: ThemeId
  photos: MediaUrls
  cartoons: MediaUrls
  musicEnabled: boolean
  sfxEnabled: boolean
  reducedMotion: boolean
  highContrast: boolean
  onCastChange: (role: CastRole, name: string) => void
  onSelectProfile: (id: string) => void
  onAddProfile: (name: string) => void
  onRenameProfile: (id: string, name: string) => void
  onMusicEnabled: (enabled: boolean) => void
  onSfxEnabled: (enabled: boolean) => void
  onReducedMotion: (enabled: boolean) => void
  onHighContrast: (enabled: boolean) => void
  onMediaChange: () => void
  onPractice: (words: string[]) => void
  onBack: () => void
}

export function ParentSettings({
  cast,
  profiles,
  activeId,
  theme,
  photos,
  cartoons,
  musicEnabled,
  sfxEnabled,
  reducedMotion,
  highContrast,
  onCastChange,
  onSelectProfile,
  onAddProfile,
  onRenameProfile,
  onMusicEnabled,
  onSfxEnabled,
  onReducedMotion,
  onHighContrast,
  onMediaChange,
  onPractice,
  onBack,
}: Props) {
  const active = profiles.find((profile) => profile.id === activeId) ?? profiles[0]
  const report = active ? coachReport(active.name, active.stars) : null
  const costume = THEME_COSTUME[theme]
  const [mediaError, setMediaError] = useState('')
  const [busyRole, setBusyRole] = useState<CastRole | null>(null)
  const [coachOpen, setCoachOpen] = useState(false)
  const [hold, setHold] = useState(0)
  const frame = useRef<number | null>(null)

  const stopHold = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
    setHold(0)
  }

  const startHold = () => {
    const began = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - began) / 1100)
      setHold(progress)
      if (progress >= 1) {
        setCoachOpen(true)
        stopHold()
        return
      }
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }

  const onPhoto = async (role: CastRole, file: File | undefined) => {
    if (!file) return
    setMediaError('')
    try {
      await savePhoto(role, await compressPhoto(file))
      onMediaChange()
    } catch {
      setMediaError('That photo could not be saved on this device.')
    }
  }

  const onRemove = async (role: CastRole) => {
    setMediaError('')
    try {
      await deleteRoleMedia(role)
      onMediaChange()
    } catch {
      setMediaError('That photo could not be removed.')
    }
  }

  const onDraw = async (role: CastRole) => {
    setMediaError('')
    setBusyRole(role)
    try {
      const photo = await loadPhoto(role)
      if (!photo) {
        setMediaError('Add a photo first.')
        return
      }
      await saveCartoon(role, theme, await cartoonFromPhoto(photo, theme, role))
      onMediaChange()
    } catch {
      setMediaError('Could not draw a cartoon. The photo frame is still here.')
    } finally {
      setBusyRole(null)
    }
  }

  return (
    <section className="enter stack-gap">
      <div className="game-header">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Back
        </button>
      </div>
      <h2 className="game-title">Parent settings</h2>
      <p className="lede">Names, photos, and progress stay on this device. Photos are not shared.</p>

      {report && active && (
        <div className="panel">
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>Progress</strong>
          <p style={{ margin: '0.55rem 0 0', fontWeight: 800 }}>
            {active.name} · ★ {active.stars} · {setTitle(maxUnlockedSet(active.stars))}
          </p>
          <p style={{ margin: '0.35rem 0 0', fontWeight: 700, color: 'var(--muted)' }}>Next: {report.nextLabel}</p>
        </div>
      )}

      <div className="panel">
        <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>Parent coach</strong>
        <p className="lede">Hold the button so a child does not open this by accident. Tips come from stars on this device.</p>
        {!coachOpen ? (
          <button
            type="button"
            className="btn btn-primary hold-gate"
            style={{ width: '100%' }}
            onPointerDown={startHold}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onPointerCancel={stopHold}
            aria-label="Hold to open parent coach"
          >
            <span className="hold-fill" style={{ ['--p' as string]: hold }} />
            {hold > 0 ? 'Keep holding…' : 'Hold to open coach'}
          </button>
        ) : (
          <div className="stack-gap" style={{ marginTop: '0.75rem' }}>
            <p style={{ margin: 0, fontWeight: 800 }}>{report?.headline}</p>
            <ul className="coach-list">
              {report?.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => report && onPractice(report.practiceWords)}
            >
              Practise these words
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setCoachOpen(false)}>
              Close coach
            </button>
          </div>
        )}
      </div>

      <div className="panel">
        <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>Sound and comfort</strong>
        <div className="stack-gap" style={{ marginTop: '0.85rem', gap: '0.65rem' }}>
          <label className="toggle-row" htmlFor="music-toggle">
            <span>Background music</span>
            <input id="music-toggle" className="switch" type="checkbox" checked={musicEnabled} onChange={(e) => onMusicEnabled(e.target.checked)} />
          </label>
          <label className="toggle-row" htmlFor="sfx-toggle">
            <span>Game sounds</span>
            <input id="sfx-toggle" className="switch" type="checkbox" checked={sfxEnabled} onChange={(e) => onSfxEnabled(e.target.checked)} />
          </label>
          <label className="toggle-row" htmlFor="motion-toggle">
            <span>Reduce motion</span>
            <input
              id="motion-toggle"
              className="switch"
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => onReducedMotion(e.target.checked)}
            />
          </label>
          <label className="toggle-row" htmlFor="contrast-toggle">
            <span>Higher contrast</span>
            <input
              id="contrast-toggle"
              className="switch"
              type="checkbox"
              checked={highContrast}
              onChange={(e) => onHighContrast(e.target.checked)}
            />
          </label>
        </div>
      </div>

      <div className="panel">
        <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>Family cast</strong>
        <p style={{ margin: '0.45rem 0 0.85rem', fontWeight: 700, color: 'var(--muted)' }}>
          Photos stay on this phone. A cartoon is drawn here for the current world, and pets stay pets.
        </p>
        {mediaError && (
          <p className="feedback" role="alert">
            {mediaError}
          </p>
        )}
        {CAST_ROLES.map((role) => {
          const src = cartoons[role] ?? photos[role]
          return (
            <div className="cast-editor" key={role}>
              <div className={`family-portrait frame-${theme}`}>
                {src ? <img src={src} alt="" /> : <span className="family-glyph">{ROLE_GLYPH[role]}</span>}
                <span className="costume">{isPet(role) ? costume.pet : costume.person}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div className="field">
                  <label htmlFor={`cast-${role}`}>{role.charAt(0).toUpperCase() + role.slice(1)}</label>
                  <input
                    id={`cast-${role}`}
                    value={cast[role]}
                    maxLength={24}
                    onChange={(e) => onCastChange(role, e.target.value)}
                  />
                </div>
                <div className="row-actions">
                  <label className="btn btn-secondary file-btn">
                    {photos[role] ? 'Change photo' : 'Add photo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0]
                        void onPhoto(role, file)
                        event.target.value = ''
                      }}
                    />
                  </label>
                  {photos[role] && (
                    <button type="button" className="btn btn-ghost" onClick={() => void onRemove(role)}>
                      Remove photo
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={!photos[role] || busyRole === role}
                    onClick={() => void onDraw(role)}
                  >
                    {busyRole === role ? 'Drawing…' : cartoons[role] ? 'Draw again' : 'Draw cartoon for this world'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="panel">
        <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>Child profiles</strong>
        <ul className="profile-list">
          {profiles.map((p) => (
            <li key={p.id} className="profile-row">
              <input
                aria-label={`Rename ${p.name}`}
                value={p.name}
                maxLength={24}
                onChange={(e) => onRenameProfile(p.id, e.target.value)}
              />
              <button
                type="button"
                className={`btn ${p.id === activeId ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onSelectProfile(p.id)}
              >
                {p.id === activeId ? 'Playing' : 'Play'}
              </button>
              <span className="profile-stars">★ {p.stars}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            const name = window.prompt('Child’s name?', 'Explorer')
            if (name !== null) onAddProfile(name)
          }}
        >
          + Add child profile
        </button>
      </div>
    </section>
  )
}
