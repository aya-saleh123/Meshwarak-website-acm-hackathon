import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconName } from '../lib/types'

const DEFAULT_ICON: Record<string, IconName> = {
  info: 'info',
  warning: 'alert',
  success: 'check-circle',
  error: 'alert',
  plain: 'info',
}

export interface NoticeProps {
  tone?: 'info' | 'warning' | 'success' | 'error' | 'plain'
  icon?: IconName
  title?: string
  children: ReactNode
  className?: string
}

export function Notice({
  tone = 'plain',
  icon,
  title,
  children,
  className,
}: NoticeProps) {
  return (
    <div
      className={[
        'notice',
        tone === 'plain' ? '' : `notice--${tone}`,
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon name={icon ?? DEFAULT_ICON[tone]} size={18} />
      <div>
        {title && <p className="notice__title">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  )
}
