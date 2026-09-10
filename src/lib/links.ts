import type { Area } from './types'

/**
 * me4warak does not ship branch addresses, so "directions" hands the user off
 * to a real map search for the office in their district instead of pointing at
 * an invented pin.
 */
export function officeQuery(authority: string | undefined, area: Area | undefined): string {
  return [authority, area?.nameAr, 'الإسكندرية'].filter(Boolean).join(' ')
}

export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function osmSearchUrl(query: string): string {
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`
}
