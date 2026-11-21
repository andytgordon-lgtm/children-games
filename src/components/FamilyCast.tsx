import type { CastRole, FamilyCast } from '../lib/profiles'
import { CAST_ROLES, isPet, ROLE_GLYPH } from '../lib/profiles'
import type { MediaUrls } from '../lib/useFamilyMedia'
import { THEME_COSTUME, type ThemeId } from '../themes/themes'

type Props = {
  cast: FamilyCast
  theme: ThemeId
  photos?: MediaUrls
  cartoons?: MediaUrls
  highlight?: CastRole[]
  cheer?: boolean
}

export function FamilyCastRow({ cast, theme, photos, cartoons, highlight, cheer }: Props) {
  const roles = highlight?.length ? highlight : CAST_ROLES.slice(0, 4)
  const costume = THEME_COSTUME[theme]
  return (
    <div className={`family-row ${cheer ? 'is-cheer' : ''}`} aria-hidden>
      {roles.map((role, i) => {
        const src = cartoons?.[role] ?? photos?.[role]
        return (
          <div key={role} className="family-face" style={{ ['--i' as string]: i }}>
            <div className={`family-portrait frame-${theme}`}>
              {src ? <img src={src} alt="" /> : <span className="family-glyph">{ROLE_GLYPH[role]}</span>}
              <span className="costume">{isPet(role) ? costume.pet : costume.person}</span>
            </div>
            <span className="family-name">{cast[role]}</span>
          </div>
        )
      })}
    </div>
  )
}
