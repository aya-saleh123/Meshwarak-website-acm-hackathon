import { readJson, writeJson } from './storage'
import type { Contribution, ContributionStatus, ContributionType } from './types'

/**
 * Community layer.
 *
 * There is no backend and — deliberately — no seeded "84 people confirmed"
 * numbers. Every count in the UI comes from contributions that were actually
 * submitted in this browser, so nothing shown is fabricated. In a real
 * deployment the same shape would be served by an API with
 * unique(contribution_id, contributor_id).
 */

/** Configurable promotion thresholds (see prompt spec). */
export const CONFIRMATION_THRESHOLDS = {
  supported: 10,
  verified: 50,
} as const

/**
 * Below this many votes we show no percentage at all — "100% confirmed" off a
 * single vote would be a misleading number even though it is arithmetically
 * true.
 */
export const MIN_VOTES_FOR_CONFIDENCE = 3

const CONTRIBUTIONS_KEY = 'contributions'
const CONTRIBUTOR_KEY = 'contributor-id'

export const CONTRIBUTION_TYPES: ContributionType[] = [
  'document',
  'hours',
  'wait',
  'step',
  'place',
  'tip',
]

export const WAIT_BUCKETS = [
  { id: 'lt15', ar: 'أقل من 15 دقيقة', en: 'Under 15 minutes' },
  { id: '15-30', ar: '15 – 30 دقيقة', en: '15 – 30 minutes' },
  { id: '30-60', ar: '30 – 60 دقيقة', en: '30 – 60 minutes' },
  { id: '1-2h', ar: 'ساعة – ساعتين', en: '1 – 2 hours' },
  { id: 'gt2h', ar: 'أكثر من ساعتين', en: 'More than 2 hours' },
]

/** Random, non-identifying id kept only in this browser. */
export function getContributorId(): string {
  let id = readJson<string | null>(CONTRIBUTOR_KEY, null)
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `anon-${Math.random().toString(36).slice(2)}`
    writeJson(CONTRIBUTOR_KEY, id)
  }
  return id
}

export function loadContributions(): Contribution[] {
  return readJson<Contribution[]>(CONTRIBUTIONS_KEY, [])
}

export function saveContributions(items: Contribution[]): void {
  writeJson(CONTRIBUTIONS_KEY, items)
}

export function statusFor(confirmations: number): ContributionStatus {
  if (confirmations >= CONFIRMATION_THRESHOLDS.verified) return 'verified'
  if (confirmations >= CONFIRMATION_THRESHOLDS.supported) return 'supported'
  return 'reported'
}

export interface NewContribution {
  serviceId: string
  areaId?: string
  type: ContributionType
  title: string
  content: string
}

export function createContribution(input: NewContribution): Contribution {
  return {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `c-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    serviceId: input.serviceId,
    areaId: input.areaId,
    type: input.type,
    title: input.title.trim(),
    content: input.content.trim(),
    createdAt: new Date().toISOString(),
    confirmations: 0,
    disputes: 0,
    votedBy: {},
    mine: true,
  }
}

export interface Confidence {
  /** Share of votes that were confirmations, 0–100. `null` when nobody voted. */
  percent: number | null
  votes: number
  contributions: number
}

export function confidenceFor(items: Contribution[]): Confidence {
  const confirmations = items.reduce((sum, item) => sum + item.confirmations, 0)
  const disputes = items.reduce((sum, item) => sum + item.disputes, 0)
  const votes = confirmations + disputes
  return {
    percent:
      votes >= MIN_VOTES_FOR_CONFIDENCE
        ? Math.round((confirmations / votes) * 100)
        : null,
    votes,
    contributions: items.length,
  }
}

/** "منذ يومين" / "2 days ago" without pulling in a date library. */
export function relativeTime(iso: string, locale: 'ar' | 'en'): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const minutes = Math.max(0, Math.round((Date.now() - then) / 60000))

  if (locale === 'ar') {
    if (minutes < 1) return 'الآن'
    if (minutes < 60) return `منذ ${minutes} دقيقة`
    const hours = Math.round(minutes / 60)
    if (hours < 24) return hours === 1 ? 'منذ ساعة' : `منذ ${hours} ساعة`
    const days = Math.round(hours / 24)
    if (days === 1) return 'منذ يوم'
    if (days === 2) return 'منذ يومين'
    if (days < 30) return `منذ ${days} يوم`
    const months = Math.round(days / 30)
    return months === 1 ? 'منذ شهر' : `منذ ${months} شهر`
  }

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.round(days / 30)}mo ago`
}
