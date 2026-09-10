// service-info.json supplies the fees, opening hours, timing and step-by-step
// procedures that data.json does not carry. It is structured separately from
// data.json (offices / feeSets are reused across services by id) so this
// module resolves those references into the flat, localized shapes the UI
// consumes.
import infoFile from '../../service-info.json'
import type {
  Deadline,
  FeeSet,
  InfoGroup,
  JourneyStep,
  Localized,
  Office,
  RawDeadline,
  RawFeeSet,
  RawOffice,
  RawServiceInfo,
  RawServiceInfoFile,
  RawTimingEntry,
  Schedule,
  ServiceInfo,
  Timing,
} from './types'

const raw = infoFile as RawServiceInfoFile

function localize(ar: string, en?: string): Localized {
  return { ar, en: en ?? ar }
}

function localizeOpt(ar: string | undefined, en?: string): Localized | undefined {
  return ar ? localize(ar, en) : undefined
}

function localizeList(ar: string[] | undefined, en: string[] | undefined): Localized[] {
  return (ar ?? []).map((value, index) => localize(value, en?.[index]))
}

function toSchedule(schedule: NonNullable<RawOffice['schedules']>[number]): Schedule {
  return {
    id: schedule.id,
    label: localize(schedule.label, schedule.label_en),
    days: localize(schedule.days, schedule.days_en),
    hours: localize(schedule.hours, schedule.hours_en),
    note: localizeOpt(schedule.note, schedule.note_en),
  }
}

function toOffice(office: RawOffice): Office {
  return {
    id: office.id,
    name: localize(office.name, office.name_en),
    schedules: (office.schedules ?? []).map(toSchedule),
  }
}

function toFeeSet(feeSet: RawFeeSet): FeeSet {
  return {
    id: feeSet.id,
    kind: feeSet.kind,
    title: localize(feeSet.title, feeSet.title_en),
    tiers: (feeSet.tiers ?? []).map((tier) => ({
      id: tier.id,
      name: localize(tier.name, tier.name_en),
      fee: localize(tier.fee, tier.fee_en),
      delivery: localize(tier.delivery, tier.delivery_en),
      note: localizeOpt(tier.note, tier.note_en),
    })),
    items: (feeSet.items ?? []).map((item) => ({
      name: localize(item.name, item.name_en),
      fee: localize(item.fee, item.fee_en),
      note: localizeOpt(item.note, item.note_en),
    })),
    total: localizeOpt(feeSet.total, feeSet.total_en),
    formula: localizeOpt(feeSet.formula, feeSet.formula_en),
    notes: localizeList(feeSet.notes, feeSet.notes_en),
  }
}

function toDeadline(deadline: RawDeadline | undefined): Deadline | undefined {
  if (!deadline) return undefined
  return {
    title: localize(deadline.title, deadline.title_en),
    body: localize(deadline.body, deadline.body_en),
  }
}

function toTimingEntry(entry: RawTimingEntry | undefined) {
  if (!entry) return undefined
  return {
    value: localize(entry.value, entry.value_en),
    note: localizeOpt(entry.note, entry.note_en),
  }
}

function toTiming(timing: RawServiceInfo['timing']): Timing {
  return {
    queue: toTimingEntry(timing?.queue),
    inOffice: toTimingEntry(timing?.inOffice),
    completion: toTimingEntry(timing?.completion),
  }
}

const OFFICES = new Map((raw.offices ?? []).map((office) => [office.id, toOffice(office)]))
const FEE_SETS = new Map((raw.feeSets ?? []).map((feeSet) => [feeSet.id, toFeeSet(feeSet)]))

function toGroup(group: NonNullable<RawServiceInfo['groups']>[number]): InfoGroup {
  return {
    id: group.id,
    label: localize(group.label, group.label_en),
    feeSet: group.feeSetId ? FEE_SETS.get(group.feeSetId) : undefined,
    unknownFees: Boolean(group.unknownFees),
    note: localizeOpt(group.note, group.note_en),
    deadline: toDeadline(group.deadline),
  }
}

function toStep(step: NonNullable<RawServiceInfo['steps']>[number]): JourneyStep {
  return {
    kind: 'step',
    title: localize(step.title, step.title_en),
    detail: localizeOpt(step.detail, step.detail_en),
  }
}

function normaliseInfo(info: RawServiceInfo): ServiceInfo {
  return {
    id: info.id,
    offices: (info.officeIds ?? [])
      .map((id) => OFFICES.get(id))
      .filter((office): office is Office => Boolean(office)),
    feeSet: info.feeSetId ? FEE_SETS.get(info.feeSetId) : undefined,
    groups: (info.groups ?? []).map(toGroup),
    timing: toTiming(info.timing),
    deadline: toDeadline(info.deadline),
    steps: (info.steps ?? []).map(toStep),
    tip: localizeOpt(info.tip?.body, info.tip?.body_en),
  }
}

const SERVICE_INFO = new Map(
  (raw.services ?? []).map((info) => [info.id, normaliseInfo(info)]),
)

export function getServiceInfo(serviceId: string): ServiceInfo | undefined {
  return SERVICE_INFO.get(serviceId)
}

/** True when we have at least one real fee figure for this service (not just an "unknown" group). */
export function hasKnownFees(info: ServiceInfo | undefined): boolean {
  if (!info) return false
  if (info.feeSet) return true
  return info.groups.some((group) => group.feeSet && !group.unknownFees)
}

export function hasKnownHours(info: ServiceInfo | undefined): boolean {
  return Boolean(info?.offices.length)
}

export function hasKnownWait(info: ServiceInfo | undefined): boolean {
  return Boolean(info?.timing.queue)
}
