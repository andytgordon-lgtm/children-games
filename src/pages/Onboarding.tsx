import { useState } from 'react'
import { getTheme, THEMES, type ThemeId } from '../themes/themes'

type Props = {
  onStart: (name: string, theme: ThemeId) => void
}

export function Onboarding({ onStart }: Props) {
  const [step, setStep] = useState<'name' | 'world'>('name')
  const [name, setName] = useState('')
  const [theme, setTheme] = useState<ThemeId>('trains')
  const chosen = getTheme(theme)

  return (
    <section className="enter stack-gap">
      <header>
        <h1 className="brand brand-hero">Sound World</h1>
        <p className="lede">UK phonics and counting play for little learners.</p>
      </header>

      {step === 'name' ? (
        <div className="panel enter">
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>
            Step 1 of 2 — who is playing?
          </strong>
          <div className="field" style={{ marginTop: '0.85rem' }}>
            <label htmlFor="child-name">Child’s name</label>
            <input
              id="child-name"
              value={name}
              placeholder="e.g. Sam"
              maxLength={24}
              autoComplete="nickname"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            onClick={() => setStep('world')}
          >
            Next: pick a world
          </button>
        </div>
      ) : (
        <div className="panel enter">
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>
            Step 2 of 2 — choose a world
          </strong>
          <div className="theme-picker" style={{ marginTop: '0.85rem' }}>
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`theme-chip ${theme === t.id ? 'is-selected' : ''}`}
                onClick={() => setTheme(t.id)}
                aria-pressed={theme === t.id}
              >
                <span className="theme-swatch" style={{ background: t.sky }} aria-hidden>
                  {t.emoji}
                </span>
                {t.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={() => onStart(name.trim() || 'Explorer', theme)}
          >
            Let’s play in {chosen.label}
          </button>
          <button type="button" className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setStep('name')}>
            ← Back to name
          </button>
        </div>
      )}

      <p style={{ color: 'var(--muted)', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>
        Progress stays on this device. Other parents can open this link and set up their own child profiles.
      </p>
    </section>
  )
}
