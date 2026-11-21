import { useState } from 'react'
import {
  graphemesUpTo,
  maxUnlockedSet,
  pickRandom,
  shuffle,
  type Grapheme,
} from '../lib/phonics'
import { speakPhoneme } from '../lib/speech'
import type { FamilyCast } from '../lib/profiles'
import { FamilyCastRow } from '../components/FamilyCast'

type Props = {
  stars: number
  cast: FamilyCast
  onStar: () => void
  onBack: () => void
}

type Round = {
  target: Grapheme
  choices: Grapheme[]
}

function makeRound(stars: number): Round {
  const unlocked = maxUnlockedSet(stars)
  const pool = graphemesUpTo(unlocked)
  const target = pickRandom(pool)
  const distractors = shuffle(pool.filter((g) => g.letter !== target.letter)).slice(0, 3)
  const choices = shuffle([target, ...distractors])
  return { target, choices }
}

export function SoundMatch({ stars, cast, onStar, onBack }: Props) {
  const [round, setRound] = useState<Round>(() => makeRound(stars))
  const [picked, setPicked] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [cheer, setCheer] = useState(false)

  const playSound = () => speakPhoneme(round.target.sound)

  const choose = (letter: string) => {
    if (picked) return
    setPicked(letter)
    if (letter === round.target.letter) {
      setFeedback('Brilliant!')
      setCheer(true)
      onStar()
      window.setTimeout(() => {
        setRound(makeRound(stars + 1))
        setPicked(null)
        setFeedback('')
        setCheer(false)
      }, 900)
    } else {
      setFeedback('Try again — listen once more')
      window.setTimeout(() => {
        setPicked(null)
        setFeedback('')
        playSound()
      }, 700)
    }
  }

  return (
    <section className="enter">
      <div className="game-header">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Home
        </button>
        <div className="stars-pill" aria-label={`${stars} stars`}>
          ★ {stars}
        </div>
      </div>
      <h2 className="game-title">Sound Match</h2>
      <p className="lede">Listen, then tap the letter that matches.</p>
      <FamilyCastRow cast={cast} cheer={cheer} highlight={['mum', 'dad', 'sister', 'dog']} />

      <div className="stack-gap" style={{ marginTop: '1rem' }}>
        <button type="button" className="speak-btn" onClick={playSound}>
          🔊 Hear the sound
          <span>Tap me, then pick the letter</span>
        </button>

        <div className="choice-grid" role="group" aria-label="Letter choices">
          {round.choices.map((g) => {
            let cls = 'btn-tap'
            if (picked === g.letter && g.letter === round.target.letter) cls += ' is-correct'
            if (picked === g.letter && g.letter !== round.target.letter) cls += ' is-wrong'
            return (
              <button
                key={g.letter}
                type="button"
                className={cls}
                onClick={() => choose(g.letter)}
                aria-label={`Letter ${g.letter}`}
              >
                {g.letter}
              </button>
            )
          })}
        </div>

        <p className={`feedback ${feedback === 'Brilliant!' ? 'good' : ''}`} aria-live="polite">
          {feedback}
        </p>
      </div>
    </section>
  )
}
