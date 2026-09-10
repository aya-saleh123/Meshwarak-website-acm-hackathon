import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Button, btnClass } from '../components/Button'
import { SearchBar } from '../components/SearchBar'
import { ServiceCard } from '../components/ServiceCard'
import { EmptyState } from '../components/EmptyState'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { useApp } from '../context/AppContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import {
  CATEGORY_GROUPS,
  getCategoryBySlug,
  searchServices,
} from '../lib/services'
import { countLabel } from '../lib/format'

export function Services() {
  const { t, lang } = useApp()
  const [params, setParams] = useSearchParams()

  const querySlug = params.get('category')
  const queryText = params.get('q') ?? ''

  const [input, setInput] = useState(queryText)
  const [debounced, setDebounced] = useState(queryText)

  useDocumentTitle(
    `${t('services.title')} · ${lang === 'ar' ? 'مشوارك' : 'me4warak'}`,
  )

  /* Keep the input in sync when the URL changes (back/forward, header links). */
  useEffect(() => {
    setInput(queryText)
    setDebounced(queryText)
  }, [queryText])

  /* Debounce so the URL and results settle while typing. */
  useEffect(() => {
    if (input === debounced) return
    const timer = window.setTimeout(() => setDebounced(input), 180)
    return () => window.clearTimeout(timer)
  }, [input, debounced])

  useEffect(() => {
    if (debounced === queryText) return
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (debounced) next.set('q', debounced)
        else next.delete('q')
        return next
      },
      { replace: true },
    )
  }, [debounced, queryText, setParams])

  const activeCategory = querySlug ? getCategoryBySlug(querySlug) : undefined
  const searching = input !== debounced

  const results = useMemo(
    () =>
      searchServices({
        query: debounced,
        categoryId: activeCategory?.id ?? null,
      }),
    [debounced, activeCategory],
  )

  function setCategory(slug: string | null) {
    const next = new URLSearchParams(params)
    if (slug) next.set('category', slug)
    else next.delete('category')
    setParams(next, { replace: true })
  }

  const grouped = !debounced && !activeCategory

  return (
    <>
      <div className="page-head">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: t('nav.home'), to: '/' },
              { label: t('services.title') },
            ]}
          />
          <h1 className="page-head__title">
            {activeCategory
              ? lang === 'ar'
                ? activeCategory.nameAr
                : activeCategory.nameEn
              : t('services.title')}
          </h1>
          <p>
            {activeCategory
              ? lang === 'ar'
                ? activeCategory.hintAr
                : activeCategory.hintEn
              : t('services.sub')}
          </p>
        </div>
      </div>

      <div className="container">
        <div className="filters">
          <SearchBar
            value={input}
            onChange={setInput}
            label={t('home.hero.searchLabel')}
            placeholder={t('home.hero.searchPlaceholder')}
          />

          <div className="filters__row">
            <div className="chips" role="group" aria-label={t('services.filter.label')}>
              <button
                type="button"
                className="chip"
                aria-pressed={!activeCategory}
                onClick={() => setCategory(null)}
              >
                {t('services.filter.all')}
                <span className="chip__count">{CATEGORY_GROUPS.length}</span>
              </button>
              {CATEGORY_GROUPS.map(({ category, services }) => (
                <button
                  key={category.id}
                  type="button"
                  className="chip"
                  aria-pressed={activeCategory?.id === category.id}
                  onClick={() => setCategory(category.slug)}
                >
                  <Icon name={category.icon} size={15} />
                  {lang === 'ar' ? category.nameAr : category.nameEn}
                  <span className="chip__count">{services.length}</span>
                </button>
              ))}
            </div>

            <div className="row">
              {searching ? (
                <span className="results-count row">
                  <span className="spinner" aria-hidden="true" />
                  {t('services.loading')}
                </span>
              ) : (
                <span className="results-count" aria-live="polite">
                  {countLabel(results.length, 'result', lang)}
                </span>
              )}
              {(debounced || activeCategory) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setInput('')
                    setDebounced('')
                    setParams(new URLSearchParams(), { replace: true })
                  }}
                >
                  <Icon name="reset" size={15} />
                  {t('services.clear')}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="section" style={{ paddingBlockStart: 'var(--sp-6)' }}>
          {results.length === 0 ? (
            <EmptyState
              title={t('services.empty.title')}
              body={t('services.empty.body')}
              action={
                <Link
                  to="/services"
                  className={btnClass('primary', 'sm')}
                  onClick={() => {
                    setInput('')
                    setDebounced('')
                  }}
                >
                  {t('services.empty.action')}
                </Link>
              }
            />
          ) : grouped ? (
            CATEGORY_GROUPS.map(({ category, services }) => (
              <section
                className="category-block"
                key={category.id}
                aria-labelledby={`cat-${category.slug}`}
              >
                <div className="category-block__head">
                  <span
                    className="icon-tile icon-tile--sm"
                    data-tone={category.tone}
                    aria-hidden="true"
                  >
                    <Icon name={category.icon} size={18} />
                  </span>
                  <h2 id={`cat-${category.slug}`}>
                    {lang === 'ar' ? category.nameAr : category.nameEn}
                  </h2>
                  <span className="text-xs text-muted">
                    {countLabel(services.length, 'service', lang)}
                  </span>
                </div>
                {/* Centred so a category with one or two services reads as
                    intentional rather than as a broken row. */}
                <div className="grid--centered">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      showCategory={false}
                    />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="grid grid--3">
              {results.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
