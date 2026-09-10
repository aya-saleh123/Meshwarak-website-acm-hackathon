import { Icon } from './Icon'
import { Badge } from './Badge'
import { Button } from './Button'
import { Notice } from './Notice'
import { useApp } from '../context/AppContext'
import { contentProps, pick } from '../lib/format'
import { getServiceInfo, hasKnownFees, hasKnownHours, hasKnownWait } from '../lib/serviceInfo'
import type { FeeSet, Localized, Service } from '../lib/types'

/**
 * The last card in a 2-column `.info-grid` would otherwise leave an empty
 * cell dangling beside it when the count is odd — span it across the full
 * row instead so the grid always looks intentionally filled.
 */
function lastOddClass(index: number, total: number): string {
  return total % 2 === 1 && index === total - 1 ? ' info-tile--span2' : ''
}

/** Documents that data.json marks as required only under a stated condition. */
export function ConditionalDocuments({ service }: { service: Service }) {
  const { t, lang } = useApp()
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
                <span {...contentProps(lang)}>{pick(doc.condition, lang)}</span>
              </Badge>
            )}
            <span className="conditional-item__doc" {...contentProps(lang)}>
              {pick(doc.name, lang)}
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
  const { t, lang } = useApp()
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
          <Notice tone="warning" key={note.ar}>
            <span {...contentProps(lang)}>{pick(note, lang)}</span>
          </Notice>
        ))}
      </div>
    </section>
  )
}

/** Renders one `FeeSet` (tiers / breakdown / free / formula) as a small table. */
function FeeSetView({ feeSet }: { feeSet: FeeSet }) {
  const { lang } = useApp()
  const breakdownTotal = feeSet.items.length + (feeSet.total ? 1 : 0)

  return (
    <div className="stack stack-2">
      <span className="field__label">{pick(feeSet.title, lang)}</span>
      {feeSet.kind === 'tiers' && (
        <div className="info-grid">
          {feeSet.tiers.map((tier, i) => (
            <div className={`info-tile${lastOddClass(i, feeSet.tiers.length)}`} key={tier.id}>
              <span className="info-tile__label">{pick(tier.name, lang)}</span>
              <span className="info-tile__value">{pick(tier.fee, lang)}</span>
              <span className="info-tile__note">{pick(tier.delivery, lang)}</span>
              {tier.note && <span className="info-tile__note">{pick(tier.note, lang)}</span>}
            </div>
          ))}
        </div>
      )}
      {(feeSet.kind === 'breakdown' || feeSet.kind === 'free') && (
        <div className="info-grid">
          {feeSet.items.map((item, i) => (
            <div className={`info-tile${lastOddClass(i, breakdownTotal)}`} key={item.name.ar}>
              <span className="info-tile__label">{pick(item.name, lang)}</span>
              <span className="info-tile__value">{pick(item.fee, lang)}</span>
              {item.note && <span className="info-tile__note">{pick(item.note, lang)}</span>}
            </div>
          ))}
          {feeSet.total && (
            <div className={`info-tile${lastOddClass(feeSet.items.length, breakdownTotal)}`} key="total">
              <span className="info-tile__label">{pick(feeSet.total, lang)}</span>
            </div>
          )}
        </div>
      )}
      {feeSet.kind === 'formula' && feeSet.formula && (
        <p className="info-tile__value">{pick(feeSet.formula, lang)}</p>
      )}
      {feeSet.notes.map((note) => (
        <Notice tone="info" key={note.ar}>
          {pick(note, lang)}
        </Notice>
      ))}
    </div>
  )
}

/**
 * One labelled value inside a (possibly shared) info-tile: the real value and
 * its note when we have it, or an inline "not specified" note when we don't.
 */
function TimeField({
  label,
  entry,
}: {
  label: string
  entry?: { value: Localized; note?: Localized }
}) {
  const { t, lang } = useApp()
  return (
    <div className="info-tile__field">
      <span className="info-tile__label">{label}</span>
      {entry ? (
        <>
          <span className="info-tile__value">{pick(entry.value, lang)}</span>
          {entry.note && <span className="info-tile__note">{pick(entry.note, lang)}</span>}
        </>
      ) : (
        <span className="info-tile__unknown">{t('detail.unknown.value')}</span>
      )}
    </div>
  )
}

/**
 * Fees, opening hours, timing and deadlines sourced from service-info.json —
 * the same figures `missingdata.md` documented, now attached to the service.
 * me4warak never invents numbers: whichever of these fields we genuinely
 * don't have for this service is marked "not specified" right where the real
 * value would otherwise go, instead of being called out in a separate panel.
 */
export function ServiceInfoPanel({
  service,
  onContribute,
}: {
  service: Service
  onContribute: () => void
}) {
  const { t, lang } = useApp()
  const info = getServiceInfo(service.id)

  const feesKnown = hasKnownFees(info)
  const hoursKnown = hasKnownHours(info)
  const waitKnown = hasKnownWait(info)
  const anyUnknown = !feesKnown || !hoursKnown || !waitKnown

  return (
    <section className="panel-section" aria-labelledby="info-heading">
      <div className="panel-section__head">
        <span className="icon-tile icon-tile--sm" data-tone="green" aria-hidden="true">
          <Icon name="money" size={18} />
        </span>
        <div>
          <h2 id="info-heading">{t('detail.info.title')}</h2>
          <p>{t('detail.info.sub')}</p>
        </div>
      </div>
      <div className="panel-section__body">
        <div className="stack stack-2">
          {info?.feeSet ? (
            // The fee set already carries its own title (e.g. "الرسوم" /
            // "تفصيل الرسوم"), so it doubles as this row's label.
            <FeeSetView feeSet={info.feeSet} />
          ) : info?.groups.length ? (
            <>
              <span className="field__label">{t('detail.unknown.fees')}</span>
              {info.groups.map((group) => (
                <div className="stack stack-2" key={group.id}>
                  <Badge variant="plain">{pick(group.label, lang)}</Badge>
                  {group.feeSet ? (
                    <FeeSetView feeSet={group.feeSet} />
                  ) : (
                    <p className="info-tile__unknown">{t('detail.unknown.value')}</p>
                  )}
                  {group.note && <Notice tone="info">{pick(group.note, lang)}</Notice>}
                  {group.deadline && (
                    <Notice tone="warning">
                      <strong>{pick(group.deadline.title, lang)}</strong> —{' '}
                      {pick(group.deadline.body, lang)}
                    </Notice>
                  )}
                </div>
              ))}
            </>
          ) : (
            <>
              <span className="field__label">{t('detail.unknown.fees')}</span>
              <p className="info-tile__unknown">{t('detail.unknown.value')}</p>
            </>
          )}
        </div>

        <div className="stack stack-2">
          <span className="field__label">{t('detail.unknown.hours')}</span>
          {hoursKnown ? (
            <div className="info-grid">
              {(() => {
                const rows = info!.offices.flatMap((office) =>
                  office.schedules.map((schedule) => ({ office, schedule })),
                )
                return rows.map(({ office, schedule }, i) => (
                  <div
                    className={`info-tile${lastOddClass(i, rows.length)}`}
                    key={`${office.id}:${schedule.id}`}
                  >
                    <span className="info-tile__label">{pick(schedule.label, lang)}</span>
                    <span className="info-tile__value">{pick(schedule.days, lang)}</span>
                    <span className="info-tile__note">{pick(schedule.hours, lang)}</span>
                    {schedule.note && (
                      <span className="info-tile__note">{pick(schedule.note, lang)}</span>
                    )}
                  </div>
                ))
              })()}
            </div>
          ) : (
            <p className="info-tile__unknown">{t('detail.unknown.value')}</p>
          )}
        </div>

        <div className="stack stack-2">
          <span className="field__label">{t('detail.info.expectedTime')}</span>
          {/* One card for "how long will this take" — the queue outside plus
              the time spent with the clerk once it's your turn. */}
          <div className="info-tile">
            <TimeField label={t('detail.unknown.wait')} entry={info?.timing.queue} />
            <TimeField label={t('detail.info.inOffice')} entry={info?.timing.inOffice} />
          </div>
        </div>

        {info?.deadline && (
          <Notice tone="warning">
            <strong>{pick(info.deadline.title, lang)}</strong> — {pick(info.deadline.body, lang)}
          </Notice>
        )}

        {info?.tip && <Notice tone="info">{pick(info.tip, lang)}</Notice>}

        {anyUnknown && (
          <Button variant="secondary" size="sm" onClick={onContribute}>
            <Icon name="plus" size={16} />
            {t('detail.unknown.cta')}
          </Button>
        )}
      </div>
    </section>
  )
}
