import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Icon } from './Icon'
import { Logo } from './Logo'
import { SettingsPopover } from './SettingsPopover'
import { btnClass } from './Button'
import { useApp } from '../context/AppContext'
import type { IconName } from '../lib/types'
import type { StringKey } from '../i18n/strings'

const LINKS: { to: string; key: StringKey; icon: IconName }[] = [
  { to: '/', key: 'nav.home', icon: 'pin' },
  { to: '/services', key: 'nav.services', icon: 'list' },
  { to: '/about', key: 'nav.about', icon: 'info' },
]

export function Header() {
  const { t } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [raised, setRaised] = useState(false)
  const location = useLocation()

  useEffect(() => setMenuOpen(false), [location.pathname, location.search])

  useEffect(() => {
    function onScroll() {
      setRaised(window.scrollY > 4)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${raised ? ' site-header--raised' : ''}`}>
      <div className="container site-header__inner">
        <Logo />

        <nav className="nav" aria-label={t('nav.primary')}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className="nav__link"
            >
              {t(link.key)}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <Link to="/services" className={btnClass('primary', 'sm', false, 'header__cta')}>
            <Icon name="search" size={16} />
            {t('nav.start')}
          </Link>
          <SettingsPopover />
          <button
            type="button"
            className="icon-btn header__burger"
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu" id="mobile-menu">
          <div className="container">
            <ul className="mobile-menu__list">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className="mobile-menu__link"
                  >
                    <Icon name={link.icon} size={18} />
                    {t(link.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
            <Link to="/services" className={btnClass('primary', 'md', true)}>
              <Icon name="search" size={18} />
              {t('nav.start')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
