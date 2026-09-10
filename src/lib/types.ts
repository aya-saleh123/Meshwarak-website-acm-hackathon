/**
 * Domain types for me4warak.
 *
 * `Raw*` types mirror the shape of the provided `data.json` exactly.
 * The `Service` / `Stage` types are the normalised shape the UI consumes so
 * that single-stage services and multi-stage services (e.g. نقل ملكية السيارة)
 * can share the same components.
 */

/* ---------------------------------- raw ---------------------------------- */

export interface RawDocument {
  name: string
  details?: string
}

export interface RawStep {
  location: string
  documents?: RawDocument[]
  requirements?: string[]
}

export interface RawConditionalDocument {
  condition: string
  document: string
}

export interface RawService {
  id: string
  name: string
  category: string
  documents?: RawDocument[]
  requirements?: string[]
  notes?: string[]
  additional_documents?: RawConditionalDocument[]
  steps?: RawStep[]
}

export interface RawDataset {
  services: RawService[]
}

/* ------------------------------- normalised ------------------------------- */

export type Tone = 'teal' | 'gold' | 'red' | 'blue' | 'green'

export interface CategoryMeta {
  /** Arabic category name exactly as it appears in data.json — the join key. */
  id: string
  slug: string
  nameAr: string
  nameEn: string
  tone: Tone
  icon: IconName
  /** Neutral one-liner describing what the category groups together. */
  hintAr: string
  hintEn: string
}

export interface ServiceDocument {
  /** Stable id used by the interactive checklist (localStorage key). */
  id: string
  name: string
  details?: string
  /** Present when the document is only needed in a specific situation. */
  condition?: string
}

export interface Stage {
  id: string
  /** Government office for this stage, when the data specifies one. */
  location?: string
  documents: ServiceDocument[]
  requirements: string[]
}

export interface Service {
  id: string
  name: string
  category: CategoryMeta
  /** Offices involved, derived from the data (stage locations or category). */
  authorities: string[]
  stages: Stage[]
  /** Flattened documents across every stage — used by the checklist. */
  documents: ServiceDocument[]
  /** Documents that only apply under a stated condition. */
  conditionalDocuments: ServiceDocument[]
  requirements: string[]
  notes: string[]
  isMultiStage: boolean
  /** Lowercased haystack for search (name + docs + aliases + category). */
  searchIndex: string
}

export interface JourneyStep {
  kind: 'documents' | 'visit' | 'requirement'
  titleAr: string
  titleEn: string
  detailAr?: string
  detailEn?: string
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
