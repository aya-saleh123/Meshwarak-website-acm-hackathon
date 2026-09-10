const EARTH_RADIUS_KM = 6371

/** Great-circle distance in kilometres (Haversine). Runs entirely in-browser. */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

export function formatDistance(km: number, locale: 'ar' | 'en'): string {
  if (km < 1) {
    const meters = Math.round(km * 1000 / 50) * 50
    return locale === 'ar' ? `حوالي ${meters} متر` : `about ${meters} m`
  }
  const value = km < 10 ? km.toFixed(1) : Math.round(km).toString()
  return locale === 'ar' ? `حوالي ${value} كم` : `about ${value} km`
}
