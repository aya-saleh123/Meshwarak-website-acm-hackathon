import { Icon } from './Icon'
import { useApp } from '../context/AppContext'
import { buildJourney } from '../lib/journey'
import type { Service } from '../lib/types'

export function StepsTimeline({ service }: { service: Service }) {
  const { t, lang } = useApp()
  const steps = buildJourney(service)

  if (!steps.length) return null

  return (
    <section className="panel-section" aria-labelledby="journey-heading">
      <div className="panel-section__head">
        <span className="icon-tile icon-tile--sm" data-tone="teal" aria-hidden="true">
          <Icon name="pin" size={18} />
        </span>
        <div>
          <h2 id="journey-heading">{t('detail.journey.title')}</h2>
          <p>{t('detail.journey.sub')}</p>
        </div>
      </div>

      <div className="panel-section__body">
        <ol className="timeline">
          {steps.map((step, index) => (
            <li className="timeline__item" key={`${step.kind}-${index}`}>
              <span className="timeline__marker" data-kind={step.kind}>
                {step.kind === 'requirement' ? (
                  <Icon name="alert" size={16} />
                ) : (
                  index + 1
                )}
              </span>
              {/* Steps mix UI language with Arabic office names from the
                  dataset, so let the browser resolve direction per step. */}
              <div className="timeline__body" dir="auto">
                <p className="timeline__title">
                  {lang === 'ar' ? step.titleAr : step.titleEn}
                </p>
                {(lang === 'ar' ? step.detailAr : step.detailEn) && (
                  <p className="timeline__detail">
                    {lang === 'ar' ? step.detailAr : step.detailEn}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
