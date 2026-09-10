import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { Badge } from './Badge'
import { useApp } from '../context/AppContext'
import { AR_CONTENT, countLabel } from '../lib/format'
import type { Service } from '../lib/types'

/**
 * The card subtitle is derived from the dataset (office + document count) —
 * the dataset has no marketing description and we do not invent one.
 */
export function ServiceCard({
  service,
  showCategory = true,
}: {
  service: Service
  showCategory?: boolean
}) {
  const { t, lang } = useApp()
  const docCount = service.documents.length

  return (
    <Link
      to={`/services/${service.id}`}
      className="service-card"
      data-tone={service.category.tone}
    >
      <div className="service-card__top">
        <span className="icon-tile icon-tile--sm" aria-hidden="true">
          <Icon name={service.category.icon} size={18} />
        </span>
        <h3 className="service-card__title" {...AR_CONTENT}>
          {service.name}
        </h3>
      </div>

      {service.authorities.length > 0 && (
        <p className="text-sm text-secondary" style={{ margin: 0 }} {...AR_CONTENT}>
          {service.authorities.join(' + ')}
        </p>
      )}

      <div className="service-card__meta">
        {showCategory && (
          <Badge tone={service.category.tone} dot>
            {lang === 'ar' ? service.category.nameAr : service.category.nameEn}
          </Badge>
        )}
        <Badge variant="plain">{countLabel(docCount, 'document', lang)}</Badge>
        {service.isMultiStage && (
          <Badge variant="warning" dot>
            {t('card.multiStage')}
          </Badge>
        )}
      </div>

      <span className="service-card__cta">
        {t('card.open')}
        <Icon name="arrow" size={16} className="icon--flip" />
      </span>
    </Link>
  )
}
