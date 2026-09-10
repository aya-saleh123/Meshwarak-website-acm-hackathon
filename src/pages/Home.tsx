import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Badge } from '../components/Badge'
import { btnClass } from '../components/Button'
import { SearchBar } from '../components/SearchBar'
import { CategoryCard } from '../components/CategoryCard'
import { ServiceCard } from '../components/ServiceCard'
import { Notice } from '../components/Notice'
import { useApp } from '../context/AppContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { CATEGORY_GROUPS, SERVICES, TOTALS } from '../lib/services'
import { countLabel, nounFor, pick } from '../lib/format'

/** Keep the homepage short — the full catalogue lives on /services. */
const HOME_SERVICE_LIMIT = 6

const HOW_STEPS = [
  { title: 'home.how.step1.title', body: 'home.how.step1.body' },
  { title: 'home.how.step2.title', body: 'home.how.step2.body' },
  { title: 'home.how.step3.title', body: 'home.how.step3.body' },
] as const

export function Home() {
  const { t, lang } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  useDocumentTitle(
    lang === 'ar'
      ? 'مشوارك | اعرف المطلوب قبل ما تروح'
      : 'me4warak | Know what you need before you go',
  )

  function goToSearch() {
    const trimmed = query.trim()
    navigate(trimmed ? `/services?q=${encodeURIComponent(trimmed)}` : '/services')
  }

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <span className="eyebrow">{t('brand.tagline')}</span>
          <h1 className="hero__title">{t('home.hero.title')}</h1>
          <p className="hero__sub">{t('home.hero.sub')}</p>

          <div className="hero__search">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={goToSearch}
              size="lg"
              withAction
              label={t('home.hero.searchLabel')}
              placeholder={t('home.hero.searchPlaceholder')}
            />
          </div>

          <div className="hero__quick">
            <span className="hero__quick-label">{t('home.hero.quick')}</span>
            {CATEGORY_GROUPS.map(({ category }) => (
              <Link
                key={category.id}
                to={`/services?category=${category.slug}`}
                className="chip"
              >
                <Icon name={category.icon} size={15} />
                {pick(category.name, lang)}
              </Link>
            ))}
          </div>

          {/* Counts are computed from the dataset — nothing here is a
              made-up "trusted by N users" figure. */}
          <div className="stat-row hero__stats">
            <span className="stat">
              <span className="stat__value">{TOTALS.services}</span>
              <span className="stat__label">
                {nounFor(TOTALS.services, 'service', lang)}{' '}
                {t('home.stats.services')}
              </span>
            </span>
            <span className="stat">
              <span className="stat__value">{TOTALS.categories}</span>
              <span className="stat__label">
                {nounFor(TOTALS.categories, 'category', lang)}
              </span>
            </span>
            <span className="stat">
              <span className="stat__value">{TOTALS.documents}</span>
              <span className="stat__label">
                {nounFor(TOTALS.documents, 'document', lang)}{' '}
                {t('home.stats.documents')}
              </span>
            </span>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="categories-heading">
        <div className="container">
          <div className="section-head">
            <div className="section-head__row">
              <div>
                <span className="eyebrow">{t('nav.services')}</span>
                <h2 id="categories-heading" style={{ marginBlockStart: 8 }}>
                  {t('home.categories.title')}
                </h2>
                <p>{t('home.categories.sub')}</p>
              </div>
              <Link to="/services" className={btnClass('secondary', 'sm')}>
                {t('home.hero.browseAll')}
                <Icon name="arrow" size={16} className="icon--flip" />
              </Link>
            </div>
          </div>

          <div className="grid--centered">
            {CATEGORY_GROUPS.map(({ category, services }) => (
              <CategoryCard
                key={category.id}
                category={category}
                count={services.length}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--sand" aria-labelledby="how-heading">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{t('brand.name')}</span>
            <h2 id="how-heading">{t('home.how.title')}</h2>
          </div>

          <div className="how-grid">
            {HOW_STEPS.map((step, index) => (
              <article className="how-card" key={step.title}>
                <span className="how-card__num" aria-hidden="true">
                  {index + 1}
                </span>
                <h3>{t(step.title)}</h3>
                <p>{t(step.body)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="all-services-heading">
        <div className="container">
          <div className="section-head">
            <div className="section-head__row">
              <div>
                <h2 id="all-services-heading">{t('home.services.title')}</h2>
                <p>{t('home.services.sub')}</p>
              </div>
              <Badge variant="plain">
                {countLabel(TOTALS.services, 'service', lang)}
              </Badge>
            </div>
          </div>

          <div className="grid--centered">
            {SERVICES.slice(0, HOME_SERVICE_LIMIT).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {SERVICES.length > HOME_SERVICE_LIMIT && (
            <div
              className="row"
              style={{
                justifyContent: 'center',
                marginBlockStart: 'var(--sp-6)',
              }}
            >
              <Link to="/services" className={btnClass('secondary', 'md')}>
                {t('home.hero.browseAll')} ({TOTALS.services})
                <Icon name="arrow" size={16} className="icon--flip" />
              </Link>
            </div>
          )}

          <div style={{ marginBlockStart: 'var(--sp-8)' }}>
            <Notice tone="warning" icon="shield">
              {t('footer.disclaimer')}
            </Notice>
          </div>
        </div>
      </section>
    </>
  )
}
