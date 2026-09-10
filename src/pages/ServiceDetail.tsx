import { Suspense, lazy, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { Badge } from '../components/Badge'
import { Button, btnClass } from '../components/Button'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { EmptyState } from '../components/EmptyState'
import { ServiceTabs, type ServiceTab } from '../components/ServiceTabs'
import { DocumentChecklist } from '../components/DocumentChecklist'
import { StepsTimeline } from '../components/StepsTimeline'
import {
  ConditionalDocuments,
  MissingInfoPanel,
  ServiceNotes,
} from '../components/ServiceExtras'
import { PlacePanel } from '../components/PlacePanel'
import { CommunityPanel } from '../components/CommunityPanel'
import { ContributionModal } from '../components/ContributionModal'
import { ServiceCard } from '../components/ServiceCard'
import { useApp } from '../context/AppContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { getService, relatedServices } from '../lib/services'
import { AR_CONTENT, countLabel } from '../lib/format'
import { googleMapsSearchUrl, officeQuery } from '../lib/links'
import { AREAS, findArea } from '../data/areas'
import type { ContributionType } from '../lib/types'

/** Leaflet is only pulled in when a map is actually rendered. */
const MapView = lazy(() =>
  import('../components/MapView').then((module) => ({ default: module.MapView })),
)

function MapSkeleton() {
  return (
    <div className="map-panel">
      <div className="map-panel__canvas skeleton" />
    </div>
  )
}

export function ServiceDetail() {
  const { serviceId } = useParams()
  const { t, lang, areaId, setAreaId, contributions } = useApp()
  const [tab, setTab] = useState<ServiceTab>('details')
  const [modal, setModal] = useState<ContributionType | null>(null)

  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const service = getService(serviceId)
  const area = findArea(areaId)

  useDocumentTitle(
    service
      ? `${service.name} · ${lang === 'ar' ? 'مشوارك' : 'me4warak'}`
      : t('detail.notFound.title'),
  )

  if (!service) {
    return (
      <div className="container section">
        <EmptyState
          icon="folder"
          title={t('detail.notFound.title')}
          body={t('detail.notFound.body')}
          action={
            <Link to="/services" className={btnClass('primary', 'sm')}>
              {t('services.empty.action')}
            </Link>
          }
        />
      </div>
    )
  }

  const related = relatedServices(service)
  const contributionCount = contributions.filter(
    (item) => item.serviceId === service.id,
  ).length

  function openContribution(type: ContributionType) {
    setModal(type)
  }

  const mapBlock = (
    <Suspense fallback={<MapSkeleton />}>
      <MapView
        areas={AREAS}
        selectedAreaId={areaId}
        onSelectArea={(id) => {
          setAreaId(id)
          setTab('place')
        }}
      >
        {isDesktop && (
          <ServiceTabs value={tab} onChange={setTab} variant="vertical" />
        )}
        <div className="map-float">
          <button
            type="button"
            className="map-float__chip"
            onClick={() => setTab('place')}
          >
            <Icon name="pin" size={16} />
            <span>
              {area
                ? `${t('place.city')} — ${lang === 'ar' ? area.nameAr : area.nameEn}`
                : t('place.chooseArea')}
            </span>
          </button>
        </div>
      </MapView>
    </Suspense>
  )

  return (
    <>
      <div className="service-hero" data-tone={service.category.tone}>
        <div className="container">
          <Breadcrumbs
            items={[
              { label: t('nav.home'), to: '/' },
              { label: t('detail.back'), to: '/services' },
              {
                label:
                  lang === 'ar'
                    ? service.category.nameAr
                    : service.category.nameEn,
                to: `/services?category=${service.category.slug}`,
              },
              { label: service.name },
            ]}
          />

          <div className="service-hero__main">
            <span className="icon-tile icon-tile--lg" aria-hidden="true">
              <Icon name={service.category.icon} size={26} />
            </span>
            <div>
              <h1 className="service-hero__title" {...AR_CONTENT}>
                {service.name}
              </h1>
              <div className="service-hero__meta">
                <Badge tone={service.category.tone} dot>
                  {lang === 'ar'
                    ? service.category.nameAr
                    : service.category.nameEn}
                </Badge>
                {service.authorities.map((authority) => (
                  <Badge variant="plain" key={authority}>
                    <Icon name="pin" size={13} />
                    <span {...AR_CONTENT}>{authority}</span>
                  </Badge>
                ))}
                <Badge variant="plain">
                  {countLabel(service.documents.length, 'document', lang)}
                </Badge>
                {service.isMultiStage && (
                  <Badge variant="warning" dot>
                    {t('card.multiStage')}
                  </Badge>
                )}
                {service.conditionalDocuments.length > 0 && (
                  <Badge tone="gold" dot>
                    {t('card.conditional')}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions here are deliberately different from the tabs: go
              straight to a real map search, share what you learned, or print
              the checklist. */}
          <div className="service-hero__actions no-print">
            {area && service.authorities.length > 0 ? (
              <a
                className={btnClass('primary', 'sm')}
                href={googleMapsSearchUrl(
                  officeQuery(service.authorities[0], area),
                )}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Icon name="pin" size={16} />
                {t('place.directions')} ·{' '}
                {lang === 'ar' ? area.nameAr : area.nameEn}
                <Icon name="external" size={14} />
              </a>
            ) : (
              <Button size="sm" onClick={() => setTab('place')}>
                <Icon name="pin" size={16} />
                {t('place.chooseArea')}
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => openContribution('document')}
            >
              <Icon name="plus" size={16} />
              {t('community.add')}
              {contributionCount > 0 ? ` (${contributionCount})` : ''}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.print()}>
              <Icon name="list" size={16} />
              {t('detail.print')}
            </Button>
          </div>
        </div>
      </div>

      <div className="container service-layout">
        {isDesktop && (
          <div className="service-layout__map no-print">{mapBlock}</div>
        )}

        <div className="service-layout__panel">
          <div className="no-print">
            <ServiceTabs value={tab} onChange={setTab} variant="horizontal" />
          </div>

          <div
            role="tabpanel"
            aria-label={t(
              tab === 'details'
                ? 'detail.tabs.details'
                : tab === 'place'
                  ? 'detail.tabs.place'
                  : 'detail.tabs.community',
            )}
            tabIndex={-1}
            className="stack"
            style={{ gap: 'var(--sp-5)' }}
          >
            {tab === 'details' && (
              <>
                <DocumentChecklist service={service} />
                <ConditionalDocuments service={service} />
                <ServiceNotes service={service} />
                <StepsTimeline service={service} />
                <MissingInfoPanel onContribute={() => openContribution('hours')} />
              </>
            )}

            {tab === 'place' && (
              <>
                {!isDesktop && <div className="no-print">{mapBlock}</div>}
                <PlacePanel service={service} />
              </>
            )}

            {tab === 'community' && (
              <CommunityPanel
                service={service}
                onAdd={() => openContribution('document')}
              />
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section
          className="section section--sand no-print"
          aria-labelledby="related-heading"
        >
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">
                {lang === 'ar'
                  ? service.category.nameAr
                  : service.category.nameEn}
              </span>
              <h2 id="related-heading">{t('detail.related.title')}</h2>
            </div>
            <div className="grid--centered">
              {related.map((item) => (
                <ServiceCard key={item.id} service={item} showCategory={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      {modal && (
        <ContributionModal
          serviceId={service.id}
          initialType={modal}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
