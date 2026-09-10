import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

/**
 * The مشوارك wordmark is supplied artwork (style.md: use the image, never a
 * font). Four variants are derived from the original file:
 *   wordmark        — mark + wordmark, for the header where the tagline would
 *                     be too small to read
 *   lockup          — full lockup including the «اعرف المطلوب قبل ما تروح»
 *                     tagline, for the footer and about page
 *   *-inverse       — the same marks recoloured for dark surfaces
 */
const SOURCES = {
  wordmark: { src: '/brand/logo-wordmark.png', width: 281, height: 112 },
  lockup: { src: '/brand/logo-lockup.png', width: 288, height: 142 },
  'wordmark-inverse': {
    src: '/brand/logo-wordmark-inverse.png',
    width: 281,
    height: 112,
  },
  'lockup-inverse': {
    src: '/brand/logo-lockup-inverse.png',
    width: 288,
    height: 142,
  },
} as const

export interface LogoProps {
  variant?: 'wordmark' | 'lockup'
  size?: 'sm' | 'md' | 'lg' | 'footer'
  /** Force the light-on-dark variant (footer). Defaults to the active theme. */
  inverse?: boolean
  asLink?: boolean
}

export function Logo({
  variant = 'wordmark',
  size = 'md',
  inverse,
  asLink = true,
}: LogoProps) {
  const { t, theme } = useApp()
  const useInverse = inverse ?? theme === 'dark'
  const asset = SOURCES[useInverse ? (`${variant}-inverse` as const) : variant]

  const alt = variant === 'lockup' ? t('brand.logoAlt') : t('brand.name')
  const image = (
    <img src={asset.src} alt={alt} width={asset.width} height={asset.height} />
  )

  const className = `logo${size === 'md' ? '' : ` logo--${size}`}`

  if (!asLink) return <span className={className}>{image}</span>

  return (
    <Link to="/" className={className} aria-label={t('brand.name')}>
      {image}
    </Link>
  )
}
