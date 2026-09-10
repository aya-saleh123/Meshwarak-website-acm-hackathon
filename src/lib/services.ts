// The dataset shipped with the project is the single source of truth — it is
// imported straight from the repo root, not copied into src.
import dataset from '../../data.json'
import { CATEGORIES, fallbackCategory } from '../data/categories'
import { CATEGORY_AUTHORITY, SEARCH_ALIASES } from '../data/authorities'
import type {
  CategoryMeta,
  RawDataset,
  RawService,
  Service,
  ServiceDocument,
  Stage,
} from './types'

const raw = dataset as RawDataset

/* ------------------------------ normalisation ----------------------------- */

function categoryFor(name: string): CategoryMeta {
  return CATEGORIES.find((c) => c.id === name) ?? fallbackCategory(name)
}

function toDocuments(
  stageId: string,
  docs: { name: string; details?: string }[] | undefined,
): ServiceDocument[] {
  return (docs ?? []).map((doc, index) => ({
    id: `${stageId}:${index}`,
    name: doc.name,
    details: doc.details,
  }))
}

function toStages(service: RawService): Stage[] {
  if (service.steps?.length) {
    return service.steps.map((step, index) => {
      const id = `${service.id}:stage-${index + 1}`
      return {
        id,
        location: step.location,
        documents: toDocuments(id, step.documents),
        requirements: step.requirements ?? [],
      }
    })
  }

  const id = `${service.id}:stage-1`
  return [
    {
      id,
      documents: toDocuments(id, service.documents),
      requirements: service.requirements ?? [],
    },
  ]
}

function authoritiesFor(service: RawService, stages: Stage[]): string[] {
  const fromStages = stages
    .map((stage) => stage.location)
    .filter((value): value is string => Boolean(value))

  if (fromStages.length) return [...new Set(fromStages)]
  return CATEGORY_AUTHORITY[service.category] ?? []
}

function normalise(service: RawService): Service {
  const stages = toStages(service)
  const documents = stages.flatMap((stage) => stage.documents)
  const conditionalDocuments: ServiceDocument[] = (
    service.additional_documents ?? []
  ).map((item, index) => ({
    id: `${service.id}:conditional-${index}`,
    name: item.document,
    condition: item.condition,
  }))

  const authorities = authoritiesFor(service, stages)
  const requirements = stages.flatMap((stage) => stage.requirements)

  const searchIndex = [
    service.name,
    service.category,
    ...authorities,
    ...documents.flatMap((doc) => [doc.name, doc.details ?? '']),
    ...conditionalDocuments.flatMap((doc) => [doc.name, doc.condition ?? '']),
    ...requirements,
    ...(service.notes ?? []),
    ...(SEARCH_ALIASES[service.id] ?? []),
  ]
    .join(' ')
    .toLowerCase()

  return {
    id: service.id,
    name: service.name,
    category: categoryFor(service.category),
    authorities,
    stages,
    documents,
    conditionalDocuments,
    requirements,
    notes: service.notes ?? [],
    isMultiStage: stages.length > 1,
    searchIndex: normaliseArabic(searchIndex),
  }
}

export const SERVICES: Service[] = (raw.services ?? []).map(normalise)

/* --------------------------------- lookups -------------------------------- */

export function getService(id: string | undefined): Service | undefined {
  if (!id) return undefined
  return SERVICES.find((service) => service.id === id)
}

export interface CategoryGroup {
  category: CategoryMeta
  services: Service[]
}

/** Categories that actually have services, in data.json order. */
export const CATEGORY_GROUPS: CategoryGroup[] = (() => {
  const groups = new Map<string, CategoryGroup>()
  for (const service of SERVICES) {
    const existing = groups.get(service.category.id)
    if (existing) {
      existing.services.push(service)
    } else {
      groups.set(service.category.id, {
        category: service.category,
        services: [service],
      })
    }
  }
  return [...groups.values()]
})()

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORY_GROUPS.find((group) => group.category.slug === slug)?.category
}

export function relatedServices(service: Service, limit = 3): Service[] {
  return SERVICES.filter(
    (item) => item.category.id === service.category.id && item.id !== service.id,
  ).slice(0, limit)
}

/* --------------------------------- search --------------------------------- */

/**
 * Fold Arabic orthographic variants so «الاسكندريه» matches «الإسكندرية»,
 * and strip tatweel/diacritics. Keeps search forgiving without a dependency.
 */
export function normaliseArabic(value: string): string {
  return value
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export interface SearchOptions {
  query?: string
  categoryId?: string | null
}

export function searchServices({ query, categoryId }: SearchOptions): Service[] {
  const terms = normaliseArabic(query ?? '')
    .split(' ')
    .filter(Boolean)

  return SERVICES.filter((service) => {
    if (categoryId && service.category.id !== categoryId) return false
    if (!terms.length) return true
    return terms.every((term) => service.searchIndex.includes(term))
  })
}

/** Total number of documents the dataset describes — used for honest counters. */
export const TOTALS = {
  services: SERVICES.length,
  categories: CATEGORY_GROUPS.length,
  documents: SERVICES.reduce(
    (sum, service) =>
      sum + service.documents.length + service.conditionalDocuments.length,
    0,
  ),
}
