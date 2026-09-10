import type { ReactNode } from 'react'
import type { IconName } from '../lib/types'

/**
 * One small stroke-based icon set so the project needs no icon dependency.
 * All icons share a 24×24 grid, `currentColor` and a 1.7 stroke.
 */
const PATHS: Record<IconName, ReactNode> = {
  'id-card': (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <circle cx="8.5" cy="11" r="2" />
      <path d="M5.5 16.6c.6-1.4 1.7-2.1 3-2.1s2.4.7 3 2.1" />
      <path d="M14.5 10h4.2M14.5 13.5h3.2" />
    </>
  ),
  family: (
    <>
      <circle cx="8.6" cy="8" r="2.7" />
      <circle cx="16.6" cy="9.6" r="2" />
      <path d="M3.2 19.2c0-2.9 2.4-4.8 5.4-4.8s5.4 1.9 5.4 4.8" />
      <path d="M15.4 19.2c0-2 1-3.4 2.6-3.4s2.8 1.3 2.8 3.4" />
    </>
  ),
  passport: (
    <>
      <rect x="4.2" y="2.8" width="15.6" height="18.4" rx="2.4" />
      <circle cx="12" cy="10.2" r="3.4" />
      <path d="M8.6 10.2h6.8" />
      <path d="M12 6.8c1.5 1.9 1.5 4.9 0 6.8M12 6.8c-1.5 1.9-1.5 4.9 0 6.8" />
      <path d="M9.4 17.6h5.2" />
    </>
  ),
  license: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <circle cx="8.8" cy="12" r="3.1" />
      <path d="M5.7 12h6.2M8.8 8.9v.6M8.8 15.1v-.6" />
      <path d="M14.8 10.4h4.4M14.8 14h3.2" />
    </>
  ),
  car: (
    <>
      <path d="M5 17.2v-3.4l1.9-4.3A2 2 0 0 1 8.7 8.2h6.6a2 2 0 0 1 1.8 1.3l1.9 4.3v3.4" />
      <path d="M5 13.8h14" />
      <circle cx="8.1" cy="17.4" r="1.5" />
      <circle cx="15.9" cy="17.4" r="1.5" />
    </>
  ),
  folder: (
    <path d="M3.5 7.6a2 2 0 0 1 2-2h3.1l1.8 2.3h8.1a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M15.9 15.9l4.6 4.6" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />,
  settings: (
    <>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.6 5.6l1.5 1.5M16.9 16.9l1.5 1.5M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5" />
    </>
  ),
  moon: <path d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.5 2.5 2.5 14 0 17M12 3.5c-2.5 2.5-2.5 14 0 17" />
    </>
  ),
  check: <path d="M5.2 12.6l4.5 4.4L18.8 7.4" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.4 12.3l2.7 2.6 4.5-5.1" />
    </>
  ),
  chevron: <path d="M6.2 9.6l5.8 5.8 5.8-5.8" />,
  arrow: <path d="M4.2 12h15M13.2 6l6 6-6 6" />,
  pin: (
    <>
      <path d="M12 21.2s6.6-6.1 6.6-10.6a6.6 6.6 0 1 0-13.2 0C5.4 15.1 12 21.2 12 21.2z" />
      <circle cx="12" cy="10.4" r="2.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.4V12l3.1 2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11.2v5.4" />
      <path d="M12 7.6v.5" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.4l8.6 14.7H3.4z" />
      <path d="M12 9.6v4" />
      <path d="M12 16.4v.5" />
    </>
  ),
  plus: <path d="M12 5.2v13.6M5.2 12h13.6" />,
  'thumb-up': (
    <>
      <path d="M7.2 10.6v9.6H4.9a1.4 1.4 0 0 1-1.4-1.4v-6.8a1.4 1.4 0 0 1 1.4-1.4z" />
      <path d="M7.2 10.6l3.4-6.4a1.4 1.4 0 0 1 2.6.7v4.2h4.5a2 2 0 0 1 2 2.4l-1.1 5.6a2 2 0 0 1-2 1.6H7.2" />
    </>
  ),
  'thumb-down': (
    <>
      <path d="M7.2 13.4V3.8H4.9a1.4 1.4 0 0 0-1.4 1.4v6.8a1.4 1.4 0 0 0 1.4 1.4z" />
      <path d="M7.2 13.4l3.4 6.4a1.4 1.4 0 0 0 2.6-.7v-4.2h4.5a2 2 0 0 0 2-2.4l-1.1-5.6a2 2 0 0 0-2-1.6H7.2" />
    </>
  ),
  list: (
    <>
      <path d="M8.6 7h11.9M8.6 12h11.9M8.6 17h11.9" />
      <path d="M4 7h.5M4 12h.5M4 17h.5" />
    </>
  ),
  people: (
    <>
      <circle cx="9.2" cy="8.6" r="3" />
      <path d="M3.2 19.4c0-3.1 2.7-5.2 6-5.2s6 2.1 6 5.2" />
      <path d="M15.8 6.3a3 3 0 0 1 0 5.6" />
      <path d="M17.4 14.7c2 .8 3.4 2.5 3.4 4.9" />
    </>
  ),
  external: (
    <>
      <path d="M14.2 4.4h5.4v5.4" />
      <path d="M19.6 4.4L11.2 12.8" />
      <path d="M18 14.6v3.9A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h3.9" />
    </>
  ),
  locate: (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="7.4" />
      <path d="M12 1.6v3.2M12 19.2v3.2M1.6 12h3.2M19.2 12h3.2" />
    </>
  ),
  reset: (
    <>
      <path d="M4.6 12a7.4 7.4 0 1 0 2.6-5.6" />
      <path d="M4.3 4.6v3.6h3.6" />
    </>
  ),
  money: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 10.4v3.2M18 10.4v3.2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.2l7 2.6v5.4c0 4.1-2.9 7.5-7 8.6-4.1-1.1-7-4.5-7-8.6V5.8z" />
      <path d="M9.3 12.2l2 2 3.5-4" />
    </>
  ),
}

export interface IconProps {
  name: IconName
  size?: number
  className?: string
  /** Icons are decorative by default; pass a label when the icon is the only content. */
  label?: string
}

export function Icon({ name, size = 20, className, label }: IconProps) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
    >
      {PATHS[name] ?? PATHS.folder}
    </svg>
  )
}
