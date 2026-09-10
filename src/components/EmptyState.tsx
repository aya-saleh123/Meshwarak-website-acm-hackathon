import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconName } from '../lib/types'

export interface EmptyStateProps {
  icon?: IconName
  title: string
  body?: string
  action?: ReactNode
}

export function EmptyState({ icon = 'search', title, body, action }: EmptyStateProps) {
  return (
    <div className="empty">
      <span className="empty__icon">
        <Icon name={icon} size={26} />
      </span>
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {action}
    </div>
  )
}
