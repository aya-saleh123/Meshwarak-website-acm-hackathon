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
    nameAr: 'بطاقة الرقم القومي',
    nameEn: 'National ID',
    tone: 'gold',
    icon: 'id-card',
    hintAr: 'الاستخراج والتجديد وبدل الفاقد',
    hintEn: 'Issuing, renewal and lost-card replacement',
  },
  {
    id: 'الأحوال المدنية',
    slug: 'civil-status',
    nameAr: 'الأحوال المدنية',
    nameEn: 'Civil Status',
    tone: 'green',
    icon: 'family',
    hintAr: 'أوراق المواليد والأسرة',
    hintEn: 'Birth and family paperwork',
  },
  {
    id: 'جوازات السفر',
    slug: 'passports',
    nameAr: 'جوازات السفر',
    nameEn: 'Passports',
    tone: 'red',
    icon: 'passport',
    hintAr: 'جوازات البالغين والأطفال وبدل الفاقد',
    hintEn: 'Adult, child and replacement passports',
  },
  {
    id: 'رخص القيادة',
    slug: 'driving-licenses',
    nameAr: 'رخص القيادة',
    nameEn: 'Driving Licenses',
    tone: 'blue',
    icon: 'license',
    hintAr: 'استخراج وتجديد الرخص',
    hintEn: 'Issuing and renewing licenses',
  },
  {
    id: 'السيارات والمرور',
    slug: 'vehicles',
    nameAr: 'السيارات والمرور',
    nameEn: 'Vehicles & Traffic',
    tone: 'teal',
    icon: 'car',
    hintAr: 'إجراءات ملكية السيارة',
    hintEn: 'Vehicle ownership procedures',
  },
]

/** Fallback so an unknown category in the data never breaks the UI. */
export function fallbackCategory(name: string): CategoryMeta {
  return {
    id: name,
    slug: encodeURIComponent(name),
    nameAr: name,
    nameEn: name,
    tone: 'teal',
    icon: 'folder',
    hintAr: '',
    hintEn: '',
  }
}
