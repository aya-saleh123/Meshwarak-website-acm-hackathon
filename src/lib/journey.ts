import { countLabel } from './format'
import type { JourneyStep, Service } from './types'

const ORDINALS_AR = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة']
const ORDINALS_EN = ['first', 'second', 'third', 'fourth', 'fifth']

/**
 * Builds the "مسار المشوار" timeline strictly from what the dataset contains:
 * stage offices, document counts and stated requirements. Nothing here adds
 * procedural steps that the data does not describe.
 */
export function buildJourney(service: Service): JourneyStep[] {
  const steps: JourneyStep[] = []

  if (service.isMultiStage) {
    service.stages.forEach((stage, index) => {
      const ordinalAr = ORDINALS_AR[index] ?? `${index + 1}`
      const ordinalEn = ORDINALS_EN[index] ?? `${index + 1}`
      steps.push({
        kind: 'visit',
        titleAr: `المرحلة ${ordinalAr}: ${stage.location ?? 'الجهة المختصة'}`,
        titleEn: `${capitalise(ordinalEn)} stage: ${stage.location ?? 'the relevant office'}`,
        detailAr: `${countLabel(stage.documents.length, 'document', 'ar')} في المرحلة دي`,
        detailEn: `${countLabel(stage.documents.length, 'document', 'en')} at this stage`,
      })
      stage.requirements.forEach((requirement) => {
        steps.push({
          kind: 'requirement',
          titleAr: requirement,
          titleEn: requirement,
        })
      })
    })
    return steps
  }

  const stage = service.stages[0]

  if (stage && stage.documents.length) {
    steps.push({
      kind: 'documents',
      titleAr: 'جهّز المستندات المطلوبة',
      titleEn: 'Prepare the required documents',
      detailAr: `${countLabel(stage.documents.length, 'document', 'ar')} في قائمتك`,
      detailEn: `${countLabel(stage.documents.length, 'document', 'en')} on your checklist`,
    })
  }

  if (service.authorities.length) {
    steps.push({
      kind: 'visit',
      titleAr: `توجّه إلى ${service.authorities.join(' ثم ')}`,
      titleEn: `Go to ${service.authorities.join(', then ')}`,
    })
  }

  service.requirements.forEach((requirement) => {
    steps.push({
      kind: 'requirement',
      titleAr: requirement,
      titleEn: requirement,
    })
  })

  return steps
}

function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
