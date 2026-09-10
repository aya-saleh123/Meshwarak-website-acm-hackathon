import { Icon } from './Icon'
import { useApp } from '../context/AppContext'
import type { IconName } from '../lib/types'

const ICONS: Record<string, IconName> = {
  success: 'check-circle',
  info: 'info',
  error: 'alert',
}

export function ToastRegion() {
  const { toast, dismissToast, t } = useApp()

  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      {toast && (
        <div className={`toast toast--${toast.tone}`} role="status">
          <Icon name={ICONS[toast.tone]} size={18} />
          <span>{toast.message}</span>
          <button
            type="button"
            className="toast__close"
            onClick={dismissToast}
            aria-label={t('common.close')}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
