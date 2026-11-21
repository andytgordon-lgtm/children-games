import type { CastRole, ChildProfile, FamilyCast } from '../lib/profiles'
import { CAST_ROLES } from '../lib/profiles'

type Props = {
  cast: FamilyCast
  profiles: ChildProfile[]
  activeId: string | null
  onCastChange: (role: CastRole, name: string) => void
  onSelectProfile: (id: string) => void
  onAddProfile: (name: string) => void
  onRenameProfile: (id: string, name: string) => void
  onBack: () => void
}

export function ParentSettings({
  cast,
  profiles,
  activeId,
  onCastChange,
  onSelectProfile,
  onAddProfile,
  onRenameProfile,
  onBack,
}: Props) {
  return (
    <section className="enter stack-gap">
      <div className="game-header">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Back
        </button>
      </div>
      <h2 className="game-title">Parent settings</h2>
      <p className="lede">Rename your family cast and manage child profiles. Everything stays on this device.</p>

      <div className="panel">
        <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>Family cast</strong>
        <div style={{ marginTop: '0.85rem' }}>
          {CAST_ROLES.map((role) => (
            <div className="field" key={role}>
              <label htmlFor={`cast-${role}`}>{role.charAt(0).toUpperCase() + role.slice(1)}</label>
              <input
                id={`cast-${role}`}
                value={cast[role]}
                maxLength={24}
                onChange={(e) => onCastChange(role, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>Child profiles</strong>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0.85rem 0 0' }}>
          {profiles.map((p) => (
            <li
              key={p.id}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                alignItems: 'center',
                marginBottom: '0.65rem',
              }}
            >
              <input
                aria-label={`Rename ${p.name}`}
                value={p.name}
                maxLength={24}
                onChange={(e) => onRenameProfile(p.id, e.target.value)}
                style={{
                  flex: '1 1 8rem',
                  minHeight: '2.75rem',
                  borderRadius: '0.9rem',
                  border: '2px solid rgba(20,40,30,0.12)',
                  padding: '0.4rem 0.75rem',
                  background: 'var(--surface-strong)',
                }}
              />
              <button
                type="button"
                className={`btn ${p.id === activeId ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onSelectProfile(p.id)}
              >
                {p.id === activeId ? 'Playing' : 'Play'}
              </button>
              <span style={{ fontWeight: 800 }}>★ {p.stars}</span>
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
