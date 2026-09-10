import type { Lang } from '../i18n/strings'

/**
 * Spread onto any element that renders content straight from data.json.
 * The dataset is Arabic, so it must stay RTL even while the UI chrome is in
 * English — otherwise document names and office names lay out wrongly.
 */
export const AR_CONTENT = { lang: 'ar', dir: 'rtl' } as const

/**
 * Arabic counting is not "n + singular". It needs the dual form and the 3–10
 * plural, otherwise the UI reads broken to an Arabic speaker:
 *   1  → مستند واحد        2  → مستندين
 *   3–10 → 5 مستندات       11+ → 11 مستند
 */
export type CountKind =
  | 'document'
  | 'service'
  | 'result'
  | 'category'
  | 'contribution'
  | 'vote'
  | 'confirmation'

interface ArabicForms {
  one: string
  two: string
  /** 3–10 */
  few: string
  /** 11+ and the generic singular noun */
  many: string
}

const AR: Record<CountKind, ArabicForms> = {
  document: { one: 'مستند واحد', two: 'مستندين', few: 'مستندات', many: 'مستند' },
  service: { one: 'خدمة واحدة', two: 'خدمتين', few: 'خدمات', many: 'خدمة' },
  result: { one: 'نتيجة واحدة', two: 'نتيجتين', few: 'نتائج', many: 'نتيجة' },
  category: { one: 'تصنيف واحد', two: 'تصنيفين', few: 'تصنيفات', many: 'تصنيف' },
  contribution: {
    one: 'مساهمة واحدة',
    two: 'مساهمتين',
    few: 'مساهمات',
    many: 'مساهمة',
  },
  vote: { one: 'تصويت واحد', two: 'تصويتين', few: 'تصويتات', many: 'تصويت' },
  confirmation: {
    one: 'تأكيد واحد',
    two: 'تأكيدين',
    few: 'تأكيدات',
    many: 'تأكيد',
  },
}

const EN: Record<CountKind, [string, string]> = {
  document: ['document', 'documents'],
  service: ['service', 'services'],
  result: ['result', 'results'],
  category: ['category', 'categories'],
  contribution: ['contribution', 'contributions'],
  vote: ['vote', 'votes'],
  confirmation: ['confirmation', 'confirmations'],
}

/** Just the noun, agreeing with `count` — for use next to a separate number. */
export function nounFor(count: number, kind: CountKind, lang: Lang): string {
  if (lang === 'en') return EN[kind][count === 1 ? 0 : 1]
  const forms = AR[kind]
  if (count === 2) return forms.two
  if (count >= 3 && count <= 10) return forms.few
  return forms.many
}

/** A complete "5 مستندات" / "مستندين" / "11 document" label. */
export function countLabel(count: number, kind: CountKind, lang: Lang): string {
  if (lang === 'en') return `${count} ${nounFor(count, kind, 'en')}`
  const forms = AR[kind]
  if (count === 1) return forms.one
  if (count === 2) return forms.two
  return `${count} ${nounFor(count, kind, 'ar')}`
}
