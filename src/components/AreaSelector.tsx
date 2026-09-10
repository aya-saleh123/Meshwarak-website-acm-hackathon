import { Icon } from './Icon'
import { Button } from './Button'
import { useApp } from '../context/AppContext'
import { AREAS } from '../data/areas'
import { formatDistance, haversineKm } from '../lib/distance'

/**
 * Manual district picker — always available so the prototype never depends on
 * the geolocation permission. When permission *is* granted we additionally
 * label the nearest district, computed in the browser.
 */
export function AreaSelector() {
  const { t, lang, areaId, setAreaId, userPosition, geoState, requestLocation } =
    useApp()

  const withDistance = AREAS.map((area) => ({
    area,
    distance: userPosition ? haversineKm(userPosition, area) : null,
  }))

  const nearestId = userPosition
    ? withDistance.reduce((best, item) =>
        (item.distance ?? Infinity) < (best.distance ?? Infinity) ? item : best,
      ).area.id
    : null

  return (
    <div className="stack stack-4">
      <div className="row row-wrap" style={{ justifyContent: 'space-between' }}>
        <span className="field__label">{t('place.areasLabel')}</span>
        <Button
          variant="secondary"
          size="sm"
          onClick={requestLocation}
          disabled={geoState === 'loading'}
        >
          {geoState === 'loading' ? (
            <span className="spinner" aria-hidden="true" />
          ) : (
            <Icon name="locate" size={16} />
          )}
          {geoState === 'loading' ? t('place.locating') : t('place.useLocation')}
        </Button>
      </div>

      <div className="area-grid" role="group" aria-label={t('place.areasLabel')}>
        {withDistance.map(({ area, distance }) => {
          const isNearest = area.id === nearestId
          return (
            <button
              key={area.id}
              type="button"
              className="area-btn"
              aria-pressed={area.id === areaId}
              data-nearest={isNearest}
              onClick={() => setAreaId(area.id)}
            >
              <span className="area-btn__name">
                {lang === 'ar' ? area.nameAr : area.nameEn}
              </span>
              <span className="area-btn__meta">
                {distance !== null
                  ? `${formatDistance(distance, lang)}${isNearest ? ` · ${t('place.nearest')}` : ''}`
                  : t('place.city')}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
