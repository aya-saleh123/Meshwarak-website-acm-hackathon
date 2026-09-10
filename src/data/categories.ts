import type { CategoryMeta } from '../lib/types'

/**
 * Metadata for the categories that actually exist in data.json.
 * The `id` is the Arabic category string used in the dataset — it is the join
 * key, so nothing here duplicates or overrides the dataset content.
 *
 * Tones follow style.md: gold = personal documents, red = travel,
 * blue = traffic, green = family, teal = general.
 */
export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'بطاقة الرقم القومي',
    slug: 'national-id',
    name: { ar: 'بطاقة الرقم القومي', en: 'National ID' },
    tone: 'gold',
    icon: 'id-card',
    hint: { ar: 'الاستخراج والتجديد وبدل الفاقد', en: 'Issuing, renewal and lost-card replacement' },
  },
  {
    id: 'الأحوال المدنية',
    slug: 'civil-status',
    name: { ar: 'الأحوال المدنية', en: 'Civil Status' },
    tone: 'green',
    icon: 'family',
    hint: { ar: 'أوراق المواليد والأسرة', en: 'Birth and family paperwork' },
  },
  {
    id: 'جوازات السفر',
    slug: 'passports',
    name: { ar: 'جوازات السفر', en: 'Passports' },
    tone: 'red',
    icon: 'passport',
    hint: { ar: 'جوازات البالغين والأطفال وبدل الفاقد', en: 'Adult, child and replacement passports' },
  },
  {
    id: 'رخص القيادة',
    slug: 'driving-licenses',
    name: { ar: 'رخص القيادة', en: 'Driving Licenses' },
    tone: 'blue',
    icon: 'license',
    hint: { ar: 'استخراج وتجديد الرخص', en: 'Issuing and renewing licenses' },
  },
  {
    id: 'السيارات والمرور',
    slug: 'vehicles',
    name: { ar: 'السيارات والمرور', en: 'Vehicles & Traffic' },
    tone: 'teal',
    icon: 'car',
    hint: { ar: 'إجراءات ملكية السيارة', en: 'Vehicle ownership procedures' },
  },
]

/** Fallback so an unknown category in the data never breaks the UI. */
export function fallbackCategory(name: string, nameEn?: string): CategoryMeta {
  return {
    id: name,
    slug: encodeURIComponent(name),
    name: { ar: name, en: nameEn ?? name },
    tone: 'teal',
    icon: 'folder',
    hint: { ar: '', en: '' },
  }
}
