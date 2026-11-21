import { useState } from 'react'
import { pickRandom, shuffle } from '../lib/phonics'
import { speakWord } from '../lib/speech'
import type { FamilyCast } from '../lib/profiles'
import { CAST_ROLES } from '../lib/profiles'
import { FamilyCastRow } from '../components/FamilyCast'
import { THEME_COUNT_GLYPHS, type ThemeId } from '../themes/themes'

type Props = {
  stars: number
  theme: ThemeId
  cast: FamilyCast
  onStar: () => void
  onBack: () => void
}

type Round = {
  count: number
  glyphs: string[]
  choices: number[]
}

function makeRound(theme: ThemeId): Round {
  const count = 1 + Math.floor(Math.random() * 10)
  const themeGlyphs = THEME_COUNT_GLYPHS[theme]
  const familyGlyphs = CAST_ROLES.map((r) => {
    const map = { mum: '👩', dad: '👨', brother: '👦', sister: '👧', dog: '🐶', cat: '🐱' } as const
    return map[r]
  })
  const pool = [...themeGlyphs, ...familyGlyphs]
  const glyph = pickRandom(pool)
  const glyphs = Array.from({ length: count }, () => glyph)

  const wrong = new Set<number>()
  while (wrong.size < 3) {
    const n = 1 + Math.floor(Math.random() * 10)
    if (n !== count) wrong.add(n)
  }
  return { count, glyphs, choices: shuffle([count, ...wrong]) }
}

export function FamilyCount({ stars, theme, cast, onStar, onBack }: Props) {
  const [round, setRound] = useState<Round>(() => makeRound(theme))
  const [picked, setPicked] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [cheer, setCheer] = useState(false)

  const choose = (n: number) => {
    if (picked !== null) return
    setPicked(n)
    if (n === round.count) {
      setFeedback('Perfect counting!')
      setCheer(true)
      speakWord(String(n))
      onStar()
      window.setTimeout(() => {
        setRound(makeRound(theme))
        setPicked(null)
        setFeedback('')
        setCheer(false)
      }, 900)
    } else {
      setFeedback('Count again carefully')
      window.setTimeout(() => {
        setPicked(null)
        setFeedback('')
      }, 700)
    }
  }

  return (
    <section className="enter">
      <div className="game-header">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Home
        </button>
        <div className="stars-pill">★ {stars}</div>
      </div>
      <h2 className="game-title">Family Count</h2>
      <p className="lede">How many can you count?</p>
      <FamilyCastRow cast={cast} cheer={cheer} />

      <div className="count-stage" aria-label={`${round.count} items to count`}>
        {round.glyphs.map((g, i) => (
          <span key={`${g}-${i}`} className="count-item" style={{ ['--i' as string]: i }}>
            {g}
          </span>
        ))}
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
