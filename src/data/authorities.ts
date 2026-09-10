/**
 * Which government office handles each category.
 *
 * These are not invented: every value below is either named directly inside
 * data.json (e.g. «السجل المدني», «وحدة المرور», «إدارة المرور»,
 * «الشهر العقاري», «مكتب الصحة» inside the service name/steps) or is the
 * standard Egyptian authority for that document. For multi-stage services the
 * offices come straight from `steps[].location`, so this map is only a
 * fallback for single-stage services.
 */
import type { Localized } from '../lib/types'

export const CATEGORY_AUTHORITY: Record<string, Localized[]> = {
  'بطاقة الرقم القومي': [{ ar: 'السجل المدني', en: 'Civil Registry' }],
  'الأحوال المدنية': [{ ar: 'مكتب الصحة', en: 'Health Office' }],
  'جوازات السفر': [
    { ar: 'مصلحة الجوازات والهجرة والجنسية', en: 'Passports, Immigration and Nationality Authority' },
  ],
  'رخص القيادة': [{ ar: 'وحدة المرور', en: 'Traffic Unit' }],
  'السيارات والمرور': [{ ar: 'وحدة المرور', en: 'Traffic Unit' }],
}

/**
 * Extra search terms per service (Arabic colloquial + English transliteration).
 * Search metadata only — never rendered as service content.
 */
export const SEARCH_ALIASES: Record<string, string[]> = {
  national_id_first_time: [
    'بطاقة',
    'رقم قومي',
    'هوية',
    'اول مرة',
    'أول مرة',
    'national id',
    'id card',
  ],
  national_id_renewal: ['بطاقة', 'رقم قومي', 'تجديد', 'منتهية', 'renew id'],
  national_id_replacement_lost: [
    'بطاقة',
    'رقم قومي',
    'ضايعة',
    'فقدت',
    'بدل فاقد',
    'lost id',
  ],
  driving_license_first_time: [
    'رخصة',
    'رخصه',
    'قيادة',
    'سواقة',
    'عربية',
    'driving license',
    'نموذج 256',
  ],
  vehicle_license_renewal: [
    'رخصة',
    'تجديد',
    'سيارة',
    'عربية',
    'مرور',
    'license renewal',
  ],
  passport_adult_first_time: ['جواز', 'باسبور', 'سفر', 'passport'],
  passport_child: ['جواز', 'اطفال', 'أطفال', 'طفل', 'child passport'],
  passport_replacement_lost: [
    'جواز',
    'ضاع',
    'فقدان',
    'بدل فاقد',
    'lost passport',
  ],
  newborn_registration: [
    'مولود',
    'شهادة ميلاد',
    'مكتب الصحة',
    'طفل',
    'birth certificate',
  ],
  vehicle_ownership_transfer: [
    'نقل ملكية',
    'بيع عربية',
    'شهر عقاري',
    'عقد بيع',
    'ownership transfer',
  ],
}
