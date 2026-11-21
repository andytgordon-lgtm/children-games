type Props = {
  onBack: () => void
  backLabel?: string
  stars: number
  celebrate?: boolean
}

export function GameHeader({ onBack, backLabel = '← Home', stars, celebrate }: Props) {
  return (
    <div className="game-header">
      <button type="button" className="btn btn-ghost" onClick={onBack}>
        {backLabel}
      </button>
      <div className={`stars-pill ${celebrate ? 'is-cheer' : ''}`} aria-label={`${stars} stars`}>
        ★ {stars}
      </div>
    </div>
  )
}
