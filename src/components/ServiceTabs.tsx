import { Icon } from './Icon'
import { useApp } from '../context/AppContext'
import type { IconName } from '../lib/types'
import type { StringKey } from '../i18n/strings'

export type ServiceTab = 'details' | 'place' | 'community'

const TABS: { id: ServiceTab; key: StringKey; icon: IconName }[] = [
  { id: 'details', key: 'detail.tabs.details', icon: 'list' },
  { id: 'community', key: 'detail.tabs.community', icon: 'people' },
  { id: 'place', key: 'detail.tabs.place', icon: 'pin' },
]

/**
 * One tab control, rendered twice: as the slim vertical bar overlaid on the map
 * (desktop) and as a horizontal bar above the panel (mobile). Only one of the
 * two is visible at any breakpoint.
 */
export function ServiceTabs({
  value,
  onChange,
  variant,
}: {
  value: ServiceTab
  onChange: (tab: ServiceTab) => void
  variant: 'vertical' | 'horizontal'
}) {
  const { t } = useApp()

  return (
    <div
      className={variant === 'vertical' ? 'map-tabs' : 'tabbar'}
      role="tablist"
      aria-orientation={variant}
      aria-label={t('detail.tabs.label')}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={value === tab.id}
          tabIndex={value === tab.id ? 0 : -1}
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' &&
                event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
            event.preventDefault()
            const index = TABS.findIndex((item) => item.id === value)
            const forward = event.key === 'ArrowDown' || event.key === 'ArrowLeft'
            const next = (index + (forward ? 1 : -1) + TABS.length) % TABS.length
            onChange(TABS[next].id)
          }}
        >
          <Icon name={tab.icon} size={variant === 'vertical' ? 20 : 16} />
          {t(tab.key)}
        </button>
      ))}
    </div>
  )
}
