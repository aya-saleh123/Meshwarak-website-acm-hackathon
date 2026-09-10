import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { useApp } from '../context/AppContext'
import { countLabel, pick } from '../lib/format'
import type { CategoryMeta } from '../lib/types'

export function CategoryCard({
  category,
  count,
}: {
  category: CategoryMeta
  count: number
}) {
  const { lang } = useApp()
  const name = pick(category.name, lang)
  const hint = pick(category.hint, lang)

  return (
    <Link
      to={`/services?category=${category.slug}`}
      className="category-card"
      data-tone={category.tone}
    >
      <span className="icon-tile" aria-hidden="true">
        <Icon name={category.icon} size={22} />
      </span>
      <span>
        <span className="category-card__title">{name}</span>
        {hint && (
          <span className="text-sm text-secondary" style={{ display: 'block' }}>
            {hint}
          </span>
        )}
        <span className="category-card__count">
          {countLabel(count, 'service', lang)}
          <Icon name="arrow" size={14} className="icon--flip" />
        </span>
      </span>
    </Link>
  )
}
