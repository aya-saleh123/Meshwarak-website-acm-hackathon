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
export const CATEGORY_AUTHORITY: Record<string, string[]> = {
  'بطاقة الرقم القومي': ['السجل المدني'],
  'الأحوال المدنية': ['مكتب الصحة'],
  'جوازات السفر': ['مصلحة الجوازات والهجرة والجنسية'],
  'رخص القيادة': ['وحدة المرور'],
  'السيارات والمرور': ['وحدة المرور'],
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
