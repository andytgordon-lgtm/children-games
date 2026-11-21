import { useState } from 'react'
import { countCeiling, pickRandom, shuffle } from '../lib/phonics'
import { speakWord } from '../lib/speech'
import { playSfx } from '../lib/audio'
import type { FamilyCast } from '../lib/profiles'
import { CAST_ROLES, ROLE_GLYPH } from '../lib/profiles'
import type { MediaUrls } from '../lib/useFamilyMedia'
import { FamilyCastRow } from '../components/FamilyCast'
import { GameHeader } from '../components/GameHeader'
import { ThemeBurst } from '../components/ThemeBurst'
import { THEME_COUNT_GLYPHS, type ThemeId } from '../themes/themes'

type Props = {
  stars: number
  theme: ThemeId
  cast: FamilyCast
  photos?: MediaUrls
  cartoons?: MediaUrls
  onStar: () => void
  onBack: () => void
}

type Glyph = { kind: 'emoji'; emoji: string } | { kind: 'face'; src: string }

type Round = {
  count: number
  glyphs: Glyph[]
  choices: number[]
}

function makeRound(theme: ThemeId, stars: number, photos: MediaUrls | undefined, cartoons: MediaUrls | undefined): Round {
  const ceiling = countCeiling(stars)
  const count = 1 + Math.floor(Math.random() * ceiling)
  const faces = CAST_ROLES.flatMap((role) => {
    const src = cartoons?.[role] ?? photos?.[role]
    return src ? [{ kind: 'face' as const, src }] : []
  })
  const emojis: Glyph[] = [...THEME_COUNT_GLYPHS[theme], ...CAST_ROLES.map((role) => ROLE_GLYPH[role])].map((emoji) => ({
    kind: 'emoji',
    emoji,
  }))
  const glyph = faces.length > 0 && Math.random() < 0.45 ? pickRandom(faces) : pickRandom(emojis)
  const glyphs = Array.from({ length: count }, () => glyph)

  const wrong = new Set<number>()
  while (wrong.size < 3) {
    const n = 1 + Math.floor(Math.random() * ceiling)
    if (n !== count) wrong.add(n)
  }
  return { count, glyphs, choices: shuffle([count, ...wrong]) }
}

export function FamilyCount({ stars, theme, cast, photos, cartoons, onStar, onBack }: Props) {
  const [round, setRound] = useState<Round>(() => makeRound(theme, stars, photos, cartoons))
  const [picked, setPicked] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [cheer, setCheer] = useState(false)

  const choose = (n: number) => {
    if (picked !== null) return
    setPicked(n)
    playSfx('tap')
    if (n === round.count) {
      playSfx('correct')
      setFeedback('Perfect counting!')
      setCheer(true)
      speakWord(String(n))
      onStar()
      window.setTimeout(() => {
        setRound(makeRound(theme, stars + 1, photos, cartoons))
        setPicked(null)
        setFeedback('')
        setCheer(false)
      }, 900)
    } else {
      playSfx('wrong')
      setFeedback('Count again carefully')
      window.setTimeout(() => {
        setPicked(null)
        setFeedback('')
      }, 700)
    }
  }

  return (
    <section className="enter">
      <GameHeader onBack={onBack} stars={stars} celebrate={cheer} />
      <h2 className="game-title">Family Count</h2>
      <p className="lede">How many can you count?</p>
      <FamilyCastRow cast={cast} theme={theme} photos={photos} cartoons={cartoons} cheer={cheer} />
      <ThemeBurst theme={theme} show={cheer} />

      <div
        className={`count-stage ${round.count > 10 ? 'is-many' : ''}`}
        aria-label="Items to count"
      >
        {round.glyphs.map((glyph, i) =>
          glyph.kind === 'face' ? (
            <img key={`face-${i}`} className="count-item count-face" src={glyph.src} alt="" style={{ ['--i' as string]: i }} />
          ) : (
            <span key={`${glyph.emoji}-${i}`} className="count-item" style={{ ['--i' as string]: i }}>
              {glyph.emoji}
            </span>
          ),
        )}
      </div>

      <div className="choice-grid" role="group" aria-label="Number choices" style={{ marginTop: '1rem' }}>
        {round.choices.map((n) => {
          let cls = 'btn-tap'
          if (picked === n && n === round.count) cls += ' is-correct'
          if (picked === n && n !== round.count) cls += ' is-wrong'
          return (
            <button key={n} type="button" className={cls} onClick={() => choose(n)}>
              {n}
            </button>
          )
        })}
      </div>

      <p className={`feedback ${feedback.startsWith('Perfect') ? 'good' : ''}`} aria-live="polite">
        {feedback}
      </p>
    </section>
  )
}
