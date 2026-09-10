import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { btnClass } from '../components/Button'
import { useApp } from '../context/AppContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFound() {
  const { t } = useApp()
  useDocumentTitle(t('notFound.title'))

  return (
    <div className="container center-page">
      <span className="empty__icon">
        <Icon name="pin" size={26} />
      </span>
      <h1>{t('notFound.title')}</h1>
      <p className="text-secondary" style={{ maxWidth: '44ch' }}>
        {t('notFound.body')}
      </p>
      <div className="row row-wrap" style={{ justifyContent: 'center' }}>
        <Link to="/" className={btnClass('primary', 'md')}>
          {t('notFound.home')}
        </Link>
        <Link to="/services" className={btnClass('secondary', 'md')}>
          {t('nav.services')}
        </Link>
      </div>
    </div>
  )
}
