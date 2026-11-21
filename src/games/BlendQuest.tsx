import { useState } from 'react'
import {
  maxUnlockedSet,
  pickRandom,
  shuffle,
  wordsUpTo,
  type CvcWord,
} from '../lib/phonics'
import { speakBlend, speakWord } from '../lib/speech'
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
  practiceWords?: string[]
  onStar: () => void
  onBack: () => void
}

type Round = {
  target: CvcWord
  choices: string[]
}

function makeRound(stars: number, practiceWords?: string[]): Round {
  const unlocked = maxUnlockedSet(stars)
  const pool = wordsUpTo(unlocked)
  const practice = (practiceWords ?? []).filter((word) => pool.some((entry) => entry.word === word))
  const target = practice.length > 0 ? pool.find((entry) => entry.word === pickRandom(practice)) ?? pickRandom(pool) : pickRandom(pool)
  const distractors = shuffle(pool.filter((w) => w.word !== target.word))
    .slice(0, 2)
    .map((w) => w.word)
  while (distractors.length < 2) {
    distractors.push(pickRandom(pool).word)
  }
  return { target, choices: shuffle([target.word, ...distractors.slice(0, 2)]) }
}

export function BlendQuest({ stars, cast, theme, photos, cartoons, practiceWords, onStar, onBack }: Props) {
  const [round, setRound] = useState<Round>(() => makeRound(stars, practiceWords))
  const [picked, setPicked] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [busy, setBusy] = useState(false)
  const [cheer, setCheer] = useState(false)
  const speaking = busy

  const playBlend = async () => {
    if (busy) return
    setBusy(true)
    await speakBlend(round.target.sounds, round.target.word)
    setBusy(false)
  }

  const choose = (word: string) => {
    if (picked || busy) return
    setPicked(word)
    playSfx('tap')
    if (word === round.target.word) {
      playSfx('correct')
      setFeedback('Yes — blended!')
      setCheer(true)
      speakWord(word)
      onStar()
      window.setTimeout(() => {
        setRound(makeRound(stars + 1, practiceWords))
        setPicked(null)
        setFeedback('')
        setCheer(false)
      }, 1000)
    } else {
      playSfx('wrong')
      setFeedback('Not that one — listen again')
      window.setTimeout(() => {
        setPicked(null)
        setFeedback('')
        void playBlend()
      }, 750)
    }
  }

  return (
    <section className="enter">
      <GameHeader onBack={onBack} stars={stars} celebrate={cheer} />
      <h2 className="game-title">Blend Quest</h2>
      <p className="lede">Hear the sounds, blend them, tap the word.</p>
      <FamilyCastRow
        cast={cast}
        theme={theme}
        photos={photos}
        cartoons={cartoons}
        cheer={cheer}
        highlight={['brother', 'sister', 'mum', 'cat']}
      />
      <ThemeBurst theme={theme} show={cheer} />

      <div className="stack-gap" style={{ marginTop: '1rem' }}>
        <button
          type="button"
          className={`speak-btn ${speaking ? 'is-speaking' : ''}`}
          onClick={() => void playBlend()}
          disabled={busy}
        >
          <span className="speak-icon" aria-hidden>🔊</span>
          Sound it out
          <span>{round.target.sounds.join(' · ')}</span>
        </button>

        <div className="choice-grid three" role="group" aria-label="Word choices">
          {round.choices.map((word) => {
            let cls = 'btn-tap'
            if (picked === word && word === round.target.word) cls += ' is-correct'
            if (picked === word && word !== round.target.word) cls += ' is-wrong'
            return (
              <button key={word} type="button" className={cls} onClick={() => choose(word)}>
                {word}
              </button>
            )
          })}
        </div>

        <p className={`feedback ${feedback.startsWith('Yes') ? 'good' : ''}`} aria-live="polite">
          {feedback}
        </p>
      </div>
    </section>
  )
}
