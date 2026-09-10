import { Icon } from './Icon'
import { Badge } from './Badge'
import { Button } from './Button'
import { Notice } from './Notice'
import { useApp } from '../context/AppContext'
import { AR_CONTENT } from '../lib/format'
import type { IconName, Service } from '../lib/types'
import type { StringKey } from '../i18n/strings'

/** Documents that data.json marks as required only under a stated condition. */
export function ConditionalDocuments({ service }: { service: Service }) {
  const { t } = useApp()
  if (!service.conditionalDocuments.length) return null

  return (
    <section className="panel-section" aria-labelledby="conditional-heading">
      <div className="panel-section__head">
        <span className="icon-tile icon-tile--sm" data-tone="gold" aria-hidden="true">
          <Icon name="folder" size={18} />
        </span>
        <div>
          <h2 id="conditional-heading">{t('detail.conditional.title')}</h2>
          <p>{t('detail.conditional.sub')}</p>
        </div>
      </div>
      <div className="panel-section__body">
        {service.conditionalDocuments.map((doc) => (
          <div className="conditional-item" key={doc.id}>
            {doc.condition && (
              <Badge tone="gold" dot>
                <span {...AR_CONTENT}>{doc.condition}</span>
              </Badge>
            )}
            <span className="conditional-item__doc" {...AR_CONTENT}>
              {doc.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * `notes` straight from the dataset. Requirements are intentionally *not*
 * repeated here — they live once, in the journey timeline, where the sequence
 * gives them context.
 */
export function ServiceNotes({ service }: { service: Service }) {
  const { t } = useApp()
  if (!service.notes.length) return null

  return (
    <section className="panel-section" aria-labelledby="notes-heading">
      <div className="panel-section__head">
        <span className="icon-tile icon-tile--sm" data-tone="blue" aria-hidden="true">
          <Icon name="info" size={18} />
        </span>
        <div>
          <h2 id="notes-heading">{t('detail.notes.title')}</h2>
        </div>
      </div>
      <div className="panel-section__body">
        {service.notes.map((note) => (
          <Notice tone="warning" key={note}>
            <span {...AR_CONTENT}>{note}</span>
          </Notice>
        ))}
      </div>
    </section>
  )
}

const UNKNOWN_FIELDS: { key: StringKey; icon: IconName }[] = [
  { key: 'detail.unknown.fees', icon: 'money' },
  { key: 'detail.unknown.hours', icon: 'clock' },
  { key: 'detail.unknown.duration', icon: 'reset' },
  { key: 'detail.unknown.wait', icon: 'people' },
]

/**
 * me4warak deliberately ships no fees, hours, processing or waiting times —
 * they are not in the dataset. Rather than inventing plausible numbers we show
 * the gap honestly and turn it into the entry point for a contribution.
 */
export function MissingInfoPanel({ onContribute }: { onContribute: () => void }) {
  const { t } = useApp()

  return (
    <section className="panel-section" aria-labelledby="unknown-heading">
      <div className="panel-section__head">
        <span className="icon-tile icon-tile--sm" data-tone="red" aria-hidden="true">
          <Icon name="alert" size={18} />
        </span>
        <div>
          <h2 id="unknown-heading">{t('detail.unknown.title')}</h2>
          <p>{t('detail.unknown.sub')}</p>
        </div>
      </div>
      <div className="panel-section__body">
        <div className="info-grid">
          {UNKNOWN_FIELDS.map((field) => (
            <div className="info-tile" key={field.key}>
              <span className="info-tile__label">
                <Icon name={field.icon} size={15} />
                {t(field.key)}
              </span>
              <span className="info-tile__value">{t('detail.unknown.value')}</span>
            </div>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={onContribute}>
          <Icon name="plus" size={16} />
          {t('detail.unknown.cta')}
        </Button>
      </div>
    </section>
  )
}
