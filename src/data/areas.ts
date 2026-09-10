import type { Area } from '../lib/types'

/**
 * Districts of Alexandria with approximate district-centre coordinates.
 *
 * These are geographic references for the map only — me4warak deliberately does
 * not ship a list of specific branch offices, opening hours or fees, because
 * that information is not part of the provided dataset and inventing it would
 * mislead users. The map centres on the chosen district and hands off to a real
 * map search for the exact office.
 */
export const ALEXANDRIA_CENTER: [number, number] = [31.2001, 29.9187]

export const AREAS: Area[] = [
  { id: 'raml-station', nameAr: 'محطة الرمل', nameEn: 'Raml Station', lat: 31.1998, lng: 29.8993 },
  { id: 'manshia', nameAr: 'المنشية', nameEn: 'Manshia', lat: 31.1955, lng: 29.8875 },
  { id: 'karmouz', nameAr: 'كرموز', nameEn: 'Karmouz', lat: 31.1878, lng: 29.8952 },
  { id: 'moharram-bek', nameAr: 'محرم بك', nameEn: 'Moharram Bek', lat: 31.1936, lng: 29.9163 },
  { id: 'ibrahimia', nameAr: 'الإبراهيمية', nameEn: 'Ibrahimia', lat: 31.2088, lng: 29.9227 },
  { id: 'sidi-gaber', nameAr: 'سيدي جابر', nameEn: 'Sidi Gaber', lat: 31.2172, lng: 29.9425 },
  { id: 'smouha', nameAr: 'سموحة', nameEn: 'Smouha', lat: 31.2073, lng: 29.9436 },
  { id: 'asafra', nameAr: 'العصافرة', nameEn: 'Asafra', lat: 31.2618, lng: 30.0008 },
  { id: 'mandara', nameAr: 'المندرة', nameEn: 'Mandara', lat: 31.2758, lng: 30.0231 },
  { id: 'montaza', nameAr: 'المنتزه', nameEn: 'Montaza', lat: 31.2866, lng: 30.0165 },
  { id: 'abu-qir', nameAr: 'أبو قير', nameEn: 'Abu Qir', lat: 31.3158, lng: 30.0641 },
  { id: 'dekheila', nameAr: 'الدخيلة', nameEn: 'Dekheila', lat: 31.1315, lng: 29.8104 },
  { id: 'agami', nameAr: 'العجمي', nameEn: 'Agami', lat: 31.0921, lng: 29.7663 },
  { id: 'borg-al-arab', nameAr: 'برج العرب', nameEn: 'Borg El Arab', lat: 30.9180, lng: 29.5460 },
]

export function findArea(id: string | null | undefined): Area | undefined {
  if (!id) return undefined
  return AREAS.find((a) => a.id === id)
}
