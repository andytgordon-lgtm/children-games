import type { CastRole, FamilyCast } from '../lib/profiles'
import { CAST_ROLES } from '../lib/profiles'

const ROLE_GLYPH: Record<CastRole, string> = {
  mum: '👩',
  dad: '👨',
  brother: '👦',
  sister: '👧',
  dog: '🐶',
  cat: '🐱',
}

type Props = {
  cast: FamilyCast
  highlight?: CastRole[]
  cheer?: boolean
}

export function FamilyCastRow({ cast, highlight, cheer }: Props) {
  const roles = highlight?.length ? highlight : CAST_ROLES.slice(0, 4)
  return (
    <div className={`family-row ${cheer ? 'is-cheer' : ''}`} aria-hidden>
      {roles.map((role, i) => (
        <div key={role} className="family-face" style={{ ['--i' as string]: i }}>
          <span className="family-glyph">{ROLE_GLYPH[role]}</span>
          <span className="family-name">{cast[role]}</span>
        </div>
      ))}
      <style>{`
        .family-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
          justify-content: center;
          margin: 0.75rem 0 0.25rem;
        }
        .family-face {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15rem;
          min-width: 3.5rem;
          animation: bob 2.6s ease-in-out infinite;
          animation-delay: calc(var(--i, 0) * 100ms);
        }
        .family-row.is-cheer .family-face {
          animation: cheer 520ms ease;
        }
        .family-glyph { font-size: 1.85rem; line-height: 1; }
        .family-name {
          font-size: 0.75rem;
          font-weight: 800;
          opacity: 0.85;
        }
      `}</style>
    </div>
  )
}
