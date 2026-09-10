import { Icon } from './Icon'
import { Button } from './Button'
import { Notice } from './Notice'
import { EmptyState } from './EmptyState'
import { ContributionCard } from './ContributionCard'
import { useApp } from '../context/AppContext'
import {
  CONFIRMATION_THRESHOLDS,
  MIN_VOTES_FOR_CONFIDENCE,
  confidenceFor,
} from '../lib/community'
import { countLabel } from '../lib/format'
import type { Service } from '../lib/types'

export function CommunityPanel({
  service,
  onAdd,
}: {
  service: Service
  onAdd: () => void
}) {
  const { t, lang, contributions } = useApp()
  const items = contributions.filter((item) => item.serviceId === service.id)
  const confidence = confidenceFor(items)

  return (
    <section className="panel-section" aria-labelledby="community-heading">
      <div className="panel-section__head">
        <span className="icon-tile icon-tile--sm" data-tone="green" aria-hidden="true">
          <Icon name="people" size={18} />
        </span>
        <div>
          <h2 id="community-heading">{t('community.title')}</h2>
          <p>{t('community.sub')}</p>
        </div>
        <div className="panel-section__actions">
          <Button size="sm" onClick={onAdd}>
            <Icon name="plus" size={16} />
            {t('community.add')}
          </Button>
        </div>
      </div>

      <div className="panel-section__body">
        {confidence.percent !== null ? (
          <div className="confidence">
            <span className="icon-tile" data-tone="green" aria-hidden="true">
              <Icon name="shield" size={22} />
            </span>
            <div>
              <span className="confidence__value">{confidence.percent}%</span>
              <span className="confidence__label" style={{ display: 'block' }}>
                {t('community.confidenceValue')} ·{' '}
                {countLabel(confidence.votes, 'vote', lang)} ·{' '}
                {countLabel(confidence.contributions, 'contribution', lang)}
              </span>
            </div>
          </div>
        ) : (
          items.length > 0 && (
            <Notice tone="info">
              {t('community.needMoreVotes', {
                needed: countLabel(
                  MIN_VOTES_FOR_CONFIDENCE - confidence.votes,
                  'confirmation',
                  lang,
                ),
              })}
            </Notice>
          )
        )}

        {items.length === 0 ? (
          <EmptyState
            icon="people"
            title={t('community.empty.title')}
            body={t('community.empty.body')}
            action={
              <Button variant="secondary" size="sm" onClick={onAdd}>
                <Icon name="plus" size={16} />
                {t('community.empty.action')}
              </Button>
            }
          />
        ) : (
          <div className="stack stack-3">
            {items.map((item) => (
              <ContributionCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <Notice tone="warning" icon="shield" title={t('community.statusNote')}>
          {t('community.thresholdNote', {
            supported: countLabel(
              CONFIRMATION_THRESHOLDS.supported,
              'confirmation',
              lang,
            ),
            verified: countLabel(
              CONFIRMATION_THRESHOLDS.verified,
              'confirmation',
              lang,
            ),
          })}
        </Notice>

        <p className="text-xs text-muted">{t('community.localNote')}</p>
      </div>
    </section>
  )
}
