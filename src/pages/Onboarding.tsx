import { useState } from 'react'
import { THEMES, type ThemeId } from '../themes/themes'

type Props = {
  onStart: (name: string, theme: ThemeId) => void
}

export function Onboarding({ onStart }: Props) {
  const [name, setName] = useState('')
  const [theme, setTheme] = useState<ThemeId>('trains')

  return (
    <section className="enter stack-gap">
      <header>
        <h1 className="brand brand-hero">Sound World</h1>
        <p className="lede">UK phonics and counting play for little learners — pick a friendly world to begin.</p>
      </header>

      <div className="panel">
        <div className="field">
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

        <strong style={{ fontFamily: 'var(--font-display)' }}>Choose a world</strong>
        <div className="theme-picker" style={{ marginTop: '0.75rem' }}>
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`theme-chip ${theme === t.id ? 'is-selected' : ''}`}
              onClick={() => setTheme(t.id)}
            >
              <span style={{ fontSize: '1.5rem' }}>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        style={{ width: '100%', minHeight: '3.75rem', fontSize: '1.35rem' }}
        onClick={() => onStart(name.trim() || 'Explorer', theme)}
      >
        Let’s play
      </button>

      <p style={{ color: 'var(--muted)', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>
        Progress stays on this device. Other parents can open this link and set up their own child profiles.
      </p>
    </section>
  )
}
