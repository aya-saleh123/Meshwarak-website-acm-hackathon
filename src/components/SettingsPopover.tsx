import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { Button } from './Button'
import { useApp } from '../context/AppContext'
import { AREAS } from '../data/areas'

export function SettingsPopover() {
  const {
    t,
    theme,
    setTheme,
    lang,
    setLang,
    areaId,
    setAreaId,
    resetLocalData,
  } = useApp()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="popover-wrap" ref={wrapRef}>
      <button
        type="button"
        className="icon-btn"
        aria-label={t('settings.open')}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name="settings" size={18} />
      </button>

      {open && (
        <div className="popover" role="dialog" aria-label={t('settings.title')}>
          <div className="popover__group">
            <span className="popover__label">{t('settings.appearance')}</span>
            <div className="segmented">
              <button
                type="button"
                aria-pressed={theme === 'light'}
                onClick={() => setTheme('light')}
              >
                <Icon name="sun" size={16} />
                {t('settings.light')}
              </button>
              <button
                type="button"
                aria-pressed={theme === 'dark'}
                onClick={() => setTheme('dark')}
              >
                <Icon name="moon" size={16} />
                {t('settings.dark')}
              </button>
            </div>
          </div>

          <div className="popover__group">
            <span className="popover__label">{t('settings.language')}</span>
            <div className="segmented">
              <button
                type="button"
                aria-pressed={lang === 'ar'}
                onClick={() => setLang('ar')}
                lang="ar"
              >
                العربية
              </button>
              <button
                type="button"
                aria-pressed={lang === 'en'}
                onClick={() => setLang('en')}
                lang="en"
              >
                English
              </button>
            </div>
          </div>

          <div className="popover__group">
            <label className="popover__label" htmlFor="settings-area">
              {t('settings.area')}
            </label>
            <div className="select-wrap">
              <select
                id="settings-area"
                className="select"
                value={areaId ?? ''}
                onChange={(event) => setAreaId(event.target.value || null)}
              >
                <option value="">{t('place.chooseArea')}</option>
                {AREAS.map((area) => (
                  <option key={area.id} value={area.id}>
                    {t('place.city')} — {area.nameAr}
                  </option>
                ))}
              </select>
              <Icon name="chevron" size={16} />
            </div>
            <span className="field__hint">{t('settings.areaHint')}</span>
          </div>

          <hr className="divider" />

          <Link
            to="/about"
            className="row text-sm"
            style={{ fontWeight: 600 }}
            onClick={() => setOpen(false)}
          >
            <Icon name="info" size={16} />
            {t('settings.about')}
          </Link>

          <div className="popover__group">
            <Button
              variant="secondary"
              size="sm"
              block
              onClick={() => {
                resetLocalData()
                setOpen(false)
              }}
            >
              <Icon name="reset" size={16} />
              {t('settings.reset')}
            </Button>
            <span className="field__hint">{t('settings.resetHint')}</span>
          </div>
        </div>
      )}
    </div>
  )
}
