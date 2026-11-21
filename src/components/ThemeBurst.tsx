import { getTheme, type ThemeId } from '../themes/themes'

type Props = {
  theme: ThemeId
  show: boolean
}

export function ThemeBurst({ theme, show }: Props) {
  if (!show) return null
  const emoji = getTheme(theme).emoji
  return (
    <div className="theme-burst" aria-hidden>
      {Array.from({ length: 6 }, (_, index) => (
        <span key={index} style={{ ['--i' as string]: index }}>
          {emoji}
        </span>
      ))}
    </div>
  )
}
