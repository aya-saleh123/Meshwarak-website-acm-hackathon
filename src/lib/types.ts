/**
 * Domain types for me4warak.
 *
 * `Raw*` types mirror the shape of the provided `data.json` / `service-info.json`
 * exactly, including their `_en` sibling keys. The normalised types below fold
 * each pair into a `Localized` value so the UI can switch language at runtime
 * without re-parsing the dataset.
 */

/** An Arabic string with its English counterpart. `en` falls back to `ar`. */
export interface Localized {
  ar: string
  en: string
}

/* ------------------------------ raw: data.json ---------------------------- */

export interface RawDocument {
  name: string
  name_en?: string
  details?: string
  details_en?: string
}

export interface RawStep {
  location: string
  location_en?: string
  documents?: RawDocument[]
  requirements?: string[]
  requirements_en?: string[]
}

export interface RawConditionalDocument {
  condition: string
  condition_en?: string
  document: string
  document_en?: string
}

export interface RawService {
  id: string
  name: string
  name_en?: string
  category: string
  category_en?: string
  documents?: RawDocument[]
  requirements?: string[]
  requirements_en?: string[]
  notes?: string[]
  notes_en?: string[]
  additional_documents?: RawConditionalDocument[]
  steps?: RawStep[]
}

export interface RawDataset {
  services: RawService[]
}

/* -------------------------- raw: service-info.json ------------------------ */

export interface RawSchedule {
  id: string
  label: string
  label_en?: string
  days: string
  days_en?: string
  hours: string
  hours_en?: string
  note?: string
  note_en?: string
}

export interface RawOffice {
  id: string
  name: string
  name_en?: string
  schedules?: RawSchedule[]
}

export interface RawFeeTier {
  id: string
  name: string
  name_en?: string
  fee: string
  fee_en?: string
  delivery: string
  delivery_en?: string
  note?: string
  note_en?: string
}

export interface RawFeeItem {
  name: string
  name_en?: string
  fee: string
  fee_en?: string
  note?: string
  note_en?: string
}

export interface RawFeeSet {
  id: string
  kind: 'tiers' | 'breakdown' | 'free' | 'formula'
  title: string
  title_en?: string
  tiers?: RawFeeTier[]
  items?: RawFeeItem[]
  total?: string
  total_en?: string
  formula?: string
  formula_en?: string
  notes?: string[]
  notes_en?: string[]
}

export interface RawTimingEntry {
  value: string
  value_en?: string
  note?: string
  note_en?: string
}

export interface RawDeadline {
  title: string
  title_en?: string
  body: string
  body_en?: string
}

export interface RawInfoStep {
  title: string
  title_en?: string
  detail?: string
  detail_en?: string
}

export interface RawInfoGroup {
  id: string
  label: string
  label_en?: string
  feeSetId?: string
  unknownFees?: boolean
  note?: string
  note_en?: string
  deadline?: RawDeadline
}

export interface RawServiceInfo {
  id: string
  officeIds?: string[]
  feeSetId?: string
  groups?: RawInfoGroup[]
  timing?: {
    queue?: RawTimingEntry
    inOffice?: RawTimingEntry
    completion?: RawTimingEntry
  }
  deadline?: RawDeadline
  steps?: RawInfoStep[]
  tip?: { body: string; body_en?: string }
}

export interface RawServiceInfoFile {
  offices?: RawOffice[]
  feeSets?: RawFeeSet[]
  services?: RawServiceInfo[]
}

/* ------------------------- normalised: data.json -------------------------- */

export type Tone = 'teal' | 'gold' | 'red' | 'blue' | 'green'

export interface CategoryMeta {
  /** Arabic category name exactly as it appears in data.json — the join key. */
  id: string
  slug: string
  name: Localized
  tone: Tone
  icon: IconName
  /** Neutral one-liner describing what the category groups together. */
  hint: Localized
}

export interface ServiceDocument {
  /** Stable id used by the interactive checklist (localStorage key). */
  id: string
  name: Localized
  details?: Localized
  /** Present when the document is only needed in a specific situation. */
  condition?: Localized
}

export interface Stage {
  id: string
  /** Government office for this stage, when the data specifies one. */
  location?: Localized
  documents: ServiceDocument[]
  requirements: Localized[]
}

export interface Service {
  id: string
  name: Localized
  category: CategoryMeta
  /** Offices involved, derived from the data (stage locations or category). */
  authorities: Localized[]
  stages: Stage[]
  /** Flattened documents across every stage — used by the checklist. */
  documents: ServiceDocument[]
  /** Documents that only apply under a stated condition. */
  conditionalDocuments: ServiceDocument[]
  requirements: Localized[]
  notes: Localized[]
  isMultiStage: boolean
  /** Lowercased haystack for search (both languages + aliases). */
  searchIndex: string
}

export interface JourneyStep {
  kind: 'documents' | 'visit' | 'requirement' | 'step'
  title: Localized
  detail?: Localized
}

/* ---------------------- normalised: service-info.json --------------------- */

export interface Schedule {
  id: string
  label: Localized
  days: Localized
  hours: Localized
  note?: Localized
}

export interface Office {
  id: string
  name: Localized
  schedules: Schedule[]
}

export interface FeeTier {
  id: string
  name: Localized
  fee: Localized
  delivery: Localized
  note?: Localized
}

export interface FeeItem {
  name: Localized
  fee: Localized
  note?: Localized
}

export interface FeeSet {
  id: string
  kind: 'tiers' | 'breakdown' | 'free' | 'formula'
  title: Localized
  tiers: FeeTier[]
  items: FeeItem[]
  total?: Localized
  formula?: Localized
  notes: Localized[]
}

export interface TimingEntry {
  value: Localized
  note?: Localized
}

export interface Timing {
  queue?: TimingEntry
  inOffice?: TimingEntry
  completion?: TimingEntry
}

export interface Deadline {
  title: Localized
  body: Localized
}

export interface InfoGroup {
  id: string
  label: Localized
  feeSet?: FeeSet
  unknownFees: boolean
  note?: Localized
  deadline?: Deadline
}

export interface ServiceInfo {
  id: string
  offices: Office[]
  feeSet?: FeeSet
  groups: InfoGroup[]
  timing: Timing
  deadline?: Deadline
  steps: JourneyStep[]
  tip?: Localized
}

/* --------------------------------- areas --------------------------------- */

export interface Area {
  id: string
  nameAr: string
  nameEn: string
  /** Approximate district centre — used to centre the map, not an office pin. */
  lat: number
  lng: number
}

/* ------------------------------- community ------------------------------- */

export type ContributionType =
  | 'document'
  | 'hours'
  | 'wait'
  | 'step'
  | 'place'
  | 'tip'

export type ContributionStatus = 'reported' | 'supported' | 'verified'

export interface Contribution {
  id: string
  serviceId: string
  areaId?: string
  type: ContributionType
  title: string
  content: string
  /** ISO timestamp. */
  createdAt: string
  confirmations: number
  disputes: number
  /** Anonymous local ids that already voted, to stop double voting. */
  votedBy: Record<string, 'confirm' | 'dispute'>
  /** True when this browser created it (lets us label it "مساهمتك"). */
  mine?: boolean
}

/* --------------------------------- icons --------------------------------- */

export type IconName =
  | 'id-card'
  | 'family'
  | 'passport'
  | 'license'
  | 'car'
  | 'folder'
  | 'search'
  | 'close'
  | 'menu'
  | 'settings'
  | 'sun'
  | 'moon'
  | 'globe'
  | 'check'
  | 'check-circle'
  | 'chevron'
  | 'arrow'
  | 'pin'
  | 'clock'
  | 'info'
  | 'alert'
  | 'plus'
  | 'thumb-up'
  | 'thumb-down'
  | 'list'
  | 'people'
  | 'external'
  | 'locate'
  | 'reset'
  | 'money'
  | 'shield'
