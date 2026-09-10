import { Icon } from './Icon'
import { Button } from './Button'
import { Notice } from './Notice'
import { useApp } from '../context/AppContext'
import { useChecklist } from '../hooks/useChecklist'
import { AR_CONTENT, countLabel } from '../lib/format'
import type { Service, ServiceDocument } from '../lib/types'

function CheckRow({
  document: doc,
  checked,
  onToggle,
}: {
  document: ServiceDocument
  checked: boolean
  onToggle: () => void
}) {
  return (
    <li className="check-item" data-checked={checked}>
      <button
        type="button"
        className="check-item__button"
        onClick={onToggle}
        aria-pressed={checked}
      >
        <span className="check-item__box" aria-hidden="true">
          <Icon name="check" size={14} />
        </span>
        <span {...AR_CONTENT}>
          <span className="check-item__label">{doc.name}</span>
          {doc.details && (
            <span className="check-item__details">{doc.details}</span>
          )}
        </span>
      </button>
    </li>
  )
}

/**
 * Interactive checklist over every document in the dataset for this service.
 * Multi-stage services keep their stages (and their offices) visible.
 */
export function DocumentChecklist({ service }: { service: Service }) {
  const { t, lang } = useApp()
  const ids = service.documents.map((doc) => doc.id)
  const { checked, toggle, reset, done, total, percent, complete } = useChecklist(
    service.id,
    ids,
  )

  return (
    <section className="panel-section" aria-labelledby="checklist-heading">
      <div className="panel-section__head">
        <span className="icon-tile icon-tile--sm" data-tone="teal" aria-hidden="true">
          <Icon name="list" size={18} />
        </span>
        <div>
          <h2 id="checklist-heading">{t('detail.checklist.title')}</h2>
          <p>{t('detail.checklist.sub')}</p>
        </div>
        {done > 0 && (
          <div className="panel-section__actions">
            <Button variant="ghost" size="sm" onClick={reset}>
              <Icon name="reset" size={15} />
              {t('detail.checklist.reset')}
            </Button>
          </div>
        )}
      </div>

      <div className="panel-section__body">
        <div className="progress">
          <div className="progress__label">
            <span>
              <span className="progress__value">
                {done} {t('detail.checklist.of')} {total}
              </span>{' '}
              {t('detail.checklist.progress')}
            </span>
            <span className="progress__value">{percent}%</span>
          </div>
          <div
            className="progress__track"
            role="progressbar"
            aria-valuenow={done}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label={t('detail.checklist.title')}
          >
            <div
              className="progress__fill"
              data-complete={complete}
              style={{ inlineSize: `${percent}%` }}
            />
          </div>
        </div>

        {complete && (
          <Notice tone="success">{t('detail.checklist.done')}</Notice>
        )}

        {service.isMultiStage ? (
          <div className="stack stack-4">
            {service.stages.map((stage, index) => (
              <div className="stage" key={stage.id}>
                <div className="stage__head">
                  <span className="stage__num" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className="stage__title">
                    {t('detail.checklist.stage')} {index + 1}
                    {stage.location ? (
                      <>
                        {' — '}
                        <span {...AR_CONTENT}>{stage.location}</span>
                      </>
                    ) : null}
                  </span>
                  <span className="stage__count">
                    {countLabel(stage.documents.length, 'document', lang)}
                  </span>
                </div>
                <div className="stage__body">
                  <ul className="checklist">
                    {stage.documents.map((doc) => (
                      <CheckRow
                        key={doc.id}
                        document={doc}
                        checked={Boolean(checked[doc.id])}
                        onToggle={() => toggle(doc.id)}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="checklist">
            {service.documents.map((doc) => (
              <CheckRow
                key={doc.id}
                document={doc}
                checked={Boolean(checked[doc.id])}
                onToggle={() => toggle(doc.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
