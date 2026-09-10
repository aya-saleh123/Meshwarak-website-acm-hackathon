import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { Notice } from '../components/Notice'
import { btnClass } from '../components/Button'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { useApp } from '../context/AppContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { TOTALS } from '../lib/services'
import type { IconName } from '../lib/types'
import type { StringKey } from '../i18n/strings'

const CARDS: { title: StringKey; body: StringKey; icon: IconName }[] = [
  { title: 'about.data.title', body: 'about.data.body', icon: 'folder' },
  { title: 'about.honest.title', body: 'about.honest.body', icon: 'shield' },
  { title: 'about.community.title', body: 'about.community.body', icon: 'people' },
  { title: 'about.privacy.title', body: 'about.privacy.body', icon: 'locate' },
  { title: 'about.scope.title', body: 'about.scope.body', icon: 'pin' },
]

export function About() {
  const { t, lang } = useApp()
  useDocumentTitle(`${t('about.title')} · ${lang === 'ar' ? 'مشوارك' : 'me4warak'}`)

  return (
    <>
      <div className="page-head">
        <div className="container">
          <Breadcrumbs
            items={[{ label: t('nav.home'), to: '/' }, { label: t('about.title') }]}
          />
          <div className="row row-wrap" style={{ marginBlockStart: 'var(--sp-4)' }}>
            <Logo variant="lockup" size="lg" asLink={false} />
          </div>
          <h1 className="page-head__title">{t('about.title')}</h1>
          <p className="about-lead">{t('about.lead')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container stack stack-8">
          <div className="prose-grid">
            {CARDS.map((card) => (
              <article className="prose-card" key={card.title}>
                <span className="icon-tile icon-tile--sm" aria-hidden="true">
                  <Icon name={card.icon} size={18} />
                </span>
                <h2 style={{ fontSize: '1.0625rem' }}>{t(card.title)}</h2>
                <p>{t(card.body)}</p>
              </article>
            ))}

            <article className="prose-card">
              <span className="icon-tile icon-tile--sm" data-tone="gold" aria-hidden="true">
                <Icon name="list" size={18} />
              </span>
              <h2 style={{ fontSize: '1.0625rem' }}>{t('about.counts.title')}</h2>
              <div className="stack">
                <div className="info-row">
                  <span className="info-row__label">
                    {t('about.counts.services')}
                  </span>
                  <span className="info-row__value">{TOTALS.services}</span>
                </div>
                <div className="info-row">
                  <span className="info-row__label">
                    {t('about.counts.categories')}
                  </span>
                  <span className="info-row__value">{TOTALS.categories}</span>
                </div>
                <div className="info-row">
                  <span className="info-row__label">
                    {t('about.counts.documents')}
                  </span>
                  <span className="info-row__value">{TOTALS.documents}</span>
                </div>
              </div>
              <Link to="/services" className={btnClass('secondary', 'sm')}>
                {t('home.hero.browseAll')}
                <Icon name="arrow" size={16} className="icon--flip" />
              </Link>
            </article>
          </div>

          <Notice tone="warning" icon="shield" title={t('footer.disclaimer')}>
            {t('footer.notGov')}
          </Notice>
        </div>
      </section>
    </>
  )
}
