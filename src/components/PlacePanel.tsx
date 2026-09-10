import { Icon } from './Icon'
import { Badge } from './Badge'
import { Notice } from './Notice'
import { AreaSelector } from './AreaSelector'
import { btnClass } from './Button'
import { useApp } from '../context/AppContext'
import { findArea } from '../data/areas'
import { formatDistance, haversineKm } from '../lib/distance'
import { googleMapsSearchUrl, officeQuery } from '../lib/links'
import { contentProps, pick } from '../lib/format'
import type { Service } from '../lib/types'

export function PlacePanel({ service }: { service: Service }) {
  const { t, lang, areaId, userPosition, geoState } = useApp()
  const area = findArea(areaId)
  const distance = userPosition && area ? haversineKm(userPosition, area) : null

  return (
    <div className="stack stack-5">
      {/* The area picker is the first thing people need in this tab, so it
          leads — the same control the settings popover offers, front and
          centre instead of tucked behind a gear icon. */}
      <section className="panel-section" aria-labelledby="area-heading">
        <div className="panel-section__head">
          <span className="icon-tile icon-tile--sm" data-tone="gold" aria-hidden="true">
            <Icon name="locate" size={18} />
          </span>
          <div>
            <h2 id="area-heading">{t('place.chooseArea')}</h2>
            <p>{t('place.privacy')}</p>
          </div>
        </div>
        <div className="panel-section__body">
          <AreaSelector />
        </div>
      </section>

      <section className="panel-section" aria-labelledby="place-heading">
        <div className="panel-section__head">
          <span className="icon-tile icon-tile--sm" data-tone="teal" aria-hidden="true">
            <Icon name="pin" size={18} />
          </span>
          <div>
            <h2 id="place-heading">{t('place.title')}</h2>
            <p>{t('place.sub')}</p>
          </div>
        </div>

        <div className="panel-section__body">
          <div className="stack stack-3">
            <span className="field__label">{t('detail.authority')}</span>
            <div className="chips">
              {service.authorities.length ? (
                service.authorities.map((authority) => (
                  <Badge key={authority.ar} tone={service.category.tone} dot>
                    <span {...contentProps(lang)}>{pick(authority, lang)}</span>
                  </Badge>
                ))
              ) : (
                <Badge variant="neutral" dot>
                  {t('detail.unknown.value')}
                </Badge>
              )}
            </div>
          </div>

          <hr className="divider" />

          <div className="info-row">
            <span className="info-row__label">{t('place.selectedArea')}</span>
            <span className="info-row__value">
              {area
                ? `${t('place.city')} — ${lang === 'ar' ? area.nameAr : area.nameEn}`
                : t('place.noArea')}
            </span>
          </div>

          {distance !== null && (
            <div className="info-row">
              <span className="info-row__label">{t('place.distance')}</span>
              <span className="info-row__value">
                {formatDistance(distance, lang)}
              </span>
            </div>
          )}

          {service.authorities.map((authority) => {
            const query = officeQuery(authority.ar, area)
            return (
              <div className="stack stack-2" key={authority.ar}>
                <span
                  className="text-xs text-muted"
                  style={{ fontWeight: 600 }}
                  {...contentProps(lang)}
                >
                  {pick(authority, lang)}
                </span>
                <div className="row row-wrap">
                  <a
                    className={btnClass('primary', 'sm')}
                    href={googleMapsSearchUrl(query)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <Icon name="pin" size={16} />
                    {t('place.directions')}
                    <Icon name="external" size={14} />
                  </a>
                </div>
              </div>
            )
          })}

          <Notice tone="info">{t('place.approxNote')}</Notice>

          {(geoState === 'denied' || geoState === 'error') && (
            <Notice tone="warning">
              {t(geoState === 'denied' ? 'place.geoDenied' : 'place.geoError')}
            </Notice>
          )}
        </div>
      </section>
    </div>
  )
}
