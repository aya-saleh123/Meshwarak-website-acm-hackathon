import { countLabel } from './format'
import type { JourneyStep, Localized, Service } from './types'
import { getServiceInfo } from './serviceInfo'

const ORDINALS_AR = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة']
const ORDINALS_EN = ['first', 'second', 'third', 'fourth', 'fifth']

function loc(ar: string, en: string): Localized {
  return { ar, en }
}

/**
 * Builds the "مسار المشوار" timeline. When service-info.json has explicit,
 * ordered steps for this service, those are used as-is — they describe the
 * real procedure. Otherwise the timeline is derived strictly from what
 * data.json contains: stage offices, document counts and requirements.
 */
export function buildJourney(service: Service): JourneyStep[] {
  const info = getServiceInfo(service.id)
  if (info?.steps.length) return info.steps

  const steps: JourneyStep[] = []

  if (service.isMultiStage) {
    service.stages.forEach((stage, index) => {
      const ordinalAr = ORDINALS_AR[index] ?? `${index + 1}`
      const ordinalEn = ORDINALS_EN[index] ?? `${index + 1}`
      const locationAr = stage.location?.ar ?? 'الجهة المختصة'
      const locationEn = stage.location?.en ?? 'the relevant office'
      steps.push({
        kind: 'visit',
        title: loc(
          `المرحلة ${ordinalAr}: ${locationAr}`,
          `${capitalise(ordinalEn)} stage: ${locationEn}`,
        ),
        detail: loc(
          `${countLabel(stage.documents.length, 'document', 'ar')} في المرحلة دي`,
          `${countLabel(stage.documents.length, 'document', 'en')} at this stage`,
        ),
      })
      stage.requirements.forEach((requirement) => {
        steps.push({ kind: 'requirement', title: requirement })
      })
    })
    return steps
  }

  const stage = service.stages[0]

  if (stage && stage.documents.length) {
    steps.push({
      kind: 'documents',
      title: loc('جهّز المستندات المطلوبة', 'Prepare the required documents'),
      detail: loc(
        `${countLabel(stage.documents.length, 'document', 'ar')} في قائمتك`,
        `${countLabel(stage.documents.length, 'document', 'en')} on your checklist`,
      ),
    })
  }

  if (service.authorities.length) {
    steps.push({
      kind: 'visit',
      title: loc(
        `توجّه إلى ${service.authorities.map((a) => a.ar).join(' ثم ')}`,
        `Go to ${service.authorities.map((a) => a.en).join(', then ')}`,
      ),
    })
  }

  service.requirements.forEach((requirement) => {
    steps.push({ kind: 'requirement', title: requirement })
  })

  return steps
}

function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
