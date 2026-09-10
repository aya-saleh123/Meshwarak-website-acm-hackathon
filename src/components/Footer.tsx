import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { Logo } from './Logo'
import { useApp } from '../context/AppContext'
import { CATEGORY_GROUPS } from '../lib/services'
import { pick } from '../lib/format'

export function Footer() {
  const { t, lang } = useApp()

  return (
    <footer className="site-footer">
      <div className="container site-footer__top">
        <div className="site-footer__brand">
          <Logo variant="lockup" size="footer" inverse asLink={false} />
          <p>{t('footer.aboutBody')}</p>
          <div className="site-footer__disclaimer">
            <Icon name="shield" size={18} />
            <span>
              {t('footer.disclaimer')}
              <br />
              {t('footer.notGov')}
            </span>
          </div>
        </div>

        <nav aria-labelledby="footer-links">
          <h3 id="footer-links">{t('footer.links')}</h3>
          <ul>
            <li>
              <Link to="/">{t('nav.home')}</Link>
            </li>
            <li>
              <Link to="/services">{t('nav.services')}</Link>
            </li>
            <li>
              <Link to="/about">{t('nav.about')}</Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-categories">
          <h3 id="footer-categories">{t('footer.categories')}</h3>
          <ul>
            {CATEGORY_GROUPS.map(({ category }) => (
              <li key={category.id}>
                <Link to={`/services?category=${category.slug}`}>
                  {pick(category.name, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container site-footer__bottom">
        <span>
          <span className="latin">me4warak</span> · {t('footer.rights')}
        </span>
        <span>{t('place.cityNote')}</span>
      </div>
    </footer>
  )
}
