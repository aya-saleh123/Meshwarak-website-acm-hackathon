import { useEffect, useMemo, useRef, useState } from 'react'
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import { Icon } from './Icon'
import { useApp } from '../context/AppContext'
import { ALEXANDRIA_CENTER } from '../data/areas'
import { formatDistance, haversineKm } from '../lib/distance'
import type { Area } from '../lib/types'

function pinIcon(active: boolean): L.DivIcon {
  const size = active ? 32 : 26
  return L.divIcon({
    className: 'map-marker',
    html: `<span class="map-pin${active ? ' map-pin--active' : ''}"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}

const USER_ICON = L.divIcon({
  className: 'map-marker',
  html: '<span class="map-pin map-pin--user"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

/** Keeps the viewport in sync with the selected district. */
function ViewSync({ target, zoom }: { target: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(target, zoom, { duration: 0.6 })
  }, [map, target, zoom])
  return null
}

/** Leaflet needs a nudge whenever its container changes size (sticky column). */
function ResizeHandler() {
  const map = useMap()
  useEffect(() => {
    const container = map.getContainer()
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(container)
    return () => observer.disconnect()
  }, [map])
  return null
}

export interface MapViewProps {
  areas: Area[]
  selectedAreaId: string | null
  onSelectArea: (id: string) => void
  children?: React.ReactNode
}

export function MapView({
  areas,
  selectedAreaId,
  onSelectArea,
  children,
}: MapViewProps) {
  const { t, lang, userPosition } = useApp()
  const [tileState, setTileState] = useState<'loading' | 'ok' | 'error'>('loading')
  const tileStateRef = useRef(tileState)
  tileStateRef.current = tileState

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (tileStateRef.current === 'loading') setTileState('error')
    }, 9000)
    return () => window.clearTimeout(timer)
  }, [])

  const selected = areas.find((area) => area.id === selectedAreaId)
  const target = useMemo<[number, number]>(
    () => (selected ? [selected.lat, selected.lng] : ALEXANDRIA_CENTER),
    [selected],
  )

  if (tileState === 'error') {
    return (
      <div className="map-panel">
        <div className="map-fallback">
          <span className="icon-tile icon-tile--lg" aria-hidden="true">
            <Icon name="alert" size={24} />
          </span>
          <h3>{t('place.mapUnavailable')}</h3>
          <p>{t('place.mapUnavailableBody')}</p>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="map-panel">
      <div className="map-panel__canvas">
        <MapContainer
          center={ALEXANDRIA_CENTER}
          zoom={selected ? 13 : 11}
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl
        >
          {/* Bottom-left keeps the zoom buttons clear of the overlaid
              district chip (top) and the attribution (bottom-right). */}
          <ZoomControl position="bottomleft" />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            maxZoom={19}
            eventHandlers={{
              load: () => setTileState('ok'),
              tileload: () => setTileState('ok'),
            }}
          />

          <ViewSync target={target} zoom={selected ? 13 : 11} />
          <ResizeHandler />

          {areas.map((area) => {
            const active = area.id === selectedAreaId
            const distance = userPosition
              ? haversineKm(userPosition, area)
              : null
            return (
              <Marker
                key={area.id}
                position={[area.lat, area.lng]}
                icon={pinIcon(active)}
                keyboard
                title={area.nameAr}
                alt={area.nameAr}
                eventHandlers={{ click: () => onSelectArea(area.id) }}
              >
                <Popup>
                  <span className="map-popup__title">
                    {lang === 'ar' ? area.nameAr : area.nameEn}
                  </span>
                  <span className="map-popup__meta" style={{ display: 'block' }}>
                    {t('place.city')}
                    {distance !== null
                      ? ` · ${formatDistance(distance, lang)}`
                      : ''}
                  </span>
                </Popup>
              </Marker>
            )
          })}

          {userPosition && (
            <Marker
              position={[userPosition.lat, userPosition.lng]}
              icon={USER_ICON}
              title={t('place.useLocation')}
              alt={t('place.useLocation')}
            />
          )}
        </MapContainer>
      </div>
      {children}
    </div>
  )
}
