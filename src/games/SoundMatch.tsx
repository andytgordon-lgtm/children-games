import { useState } from 'react'
import {
  graphemesUpTo,
  maxUnlockedSet,
  pickRandom,
  shuffle,
  type Grapheme,
} from '../lib/phonics'
import { speakPhoneme, speakWord } from '../lib/speech'
import { playSfx } from '../lib/audio'
import type { FamilyCast } from '../lib/profiles'
import type { MediaUrls } from '../lib/useFamilyMedia'
import { FamilyCastRow } from '../components/FamilyCast'
import { GameHeader } from '../components/GameHeader'
import { ThemeBurst } from '../components/ThemeBurst'
import type { ThemeId } from '../themes/themes'

type Props = {
  stars: number
  cast: FamilyCast
  theme: ThemeId
  photos?: MediaUrls
  cartoons?: MediaUrls
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
  // Never offer two spellings of the same sound (e.g. c and k) as choices
  const distractors = shuffle(pool.filter((g) => g.sound !== target.sound)).slice(0, 3)
  const choices = shuffle([target, ...distractors])
  return { target, choices }
}

export function SoundMatch({ stars, cast, theme, photos, cartoons, onStar, onBack }: Props) {
  const [round, setRound] = useState<Round>(() => makeRound(stars))
  const [picked, setPicked] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [cheer, setCheer] = useState(false)
  const [speaking, setSpeaking] = useState(false)

  const playSound = () => {
    setSpeaking(true)
    speakPhoneme(round.target.sound)
    window.setTimeout(() => {
      speakWord(round.target.key)
      setSpeaking(false)
    }, 900)
  }

  const choose = (letter: string) => {
    if (picked) return
    setPicked(letter)
    playSfx('tap')
    if (letter === round.target.letter) {
      playSfx('correct')
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
      playSfx('wrong')
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
      <GameHeader onBack={onBack} stars={stars} celebrate={cheer} />
      <h2 className="game-title">Sound Match</h2>
      <p className="lede">Listen, then tap the letter that matches.</p>
      <FamilyCastRow
        cast={cast}
        theme={theme}
        photos={photos}
        cartoons={cartoons}
        cheer={cheer}
        highlight={['mum', 'dad', 'sister', 'dog']}
      />
      <ThemeBurst theme={theme} show={cheer} />

      <div className="stack-gap" style={{ marginTop: '1rem' }}>
        <button type="button" className={`speak-btn ${speaking ? 'is-speaking' : ''}`} onClick={playSound}>
          <span className="speak-icon" aria-hidden>🔊</span>
          Hear the sound
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
