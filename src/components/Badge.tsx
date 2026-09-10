import type { ReactNode } from 'react'
import type { Tone } from '../lib/types'

export interface BadgeProps {
  children: ReactNode
  /** Category tone (drives background + border). */
  tone?: Tone
  /** Status variants used by the community layer. */
  variant?: 'success' | 'warning' | 'neutral' | 'plain'
  /** Adds a coloured dot — status is never communicated by colour alone,
   *  the label text always states it too. */
  dot?: boolean
  className?: string
}

export function Badge({ children, tone, variant, dot, className }: BadgeProps) {
  const classes = ['badge', variant ? `badge--${variant}` : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} data-tone={tone}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {children}
    </span>
  )
}
