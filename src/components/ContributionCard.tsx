import { Icon } from './Icon'
import { Badge } from './Badge'
import { useApp } from '../context/AppContext'
import { getContributorId, relativeTime, statusFor } from '../lib/community'
import { findArea } from '../data/areas'
import type { Contribution } from '../lib/types'
import type { StringKey } from '../i18n/strings'

const STATUS_VARIANT = {
  reported: 'neutral',
  supported: 'warning',
  verified: 'success',
} as const

export function ContributionCard({ item }: { item: Contribution }) {
  const { t, lang, voteContribution, deleteContribution } = useApp()
  const contributorId = getContributorId()
  const myVote = item.votedBy[contributorId]
  const status = statusFor(item.confirmations)
  const area = findArea(item.areaId)

  return (
    <article className="contrib">
      <div className="contrib__head">
        <Badge variant="plain">
          {t(`community.type.${item.type}` as StringKey)}
        </Badge>
        <Badge variant={STATUS_VARIANT[status]} dot>
          {t(`community.status.${status}` as StringKey)}
        </Badge>
        {item.mine && <Badge tone="teal">{t('community.mine')}</Badge>}
      </div>

      {/* User-written text: let the browser resolve its direction. */}
      <h3 className="contrib__title" dir="auto">
        {item.title}
      </h3>
      {item.content && (
        <p className="contrib__body" dir="auto">
          {item.content}
        </p>
      )}

      <div className="contrib__meta">
        <Icon name="people" size={14} />
        <span>{lang === 'ar' ? 'زائر مجهول' : 'Anonymous visitor'}</span>
        <span aria-hidden="true">·</span>
        <span>{relativeTime(item.createdAt, lang)}</span>
        {area && (
          <>
            <span aria-hidden="true">·</span>
            <span>{lang === 'ar' ? area.nameAr : area.nameEn}</span>
          </>
        )}
      </div>

      <div className="contrib__votes">
        <button
          type="button"
          className="vote-btn"
          data-vote="confirm"
          data-active={myVote === 'confirm'}
          disabled={Boolean(myVote)}
          onClick={() => voteContribution(item.id, 'confirm')}
        >
          <Icon name="thumb-up" size={15} />
          {t('community.confirm')}
          <span className="vote-btn__count">({item.confirmations})</span>
        </button>
        <button
          type="button"
          className="vote-btn"
          data-vote="dispute"
          data-active={myVote === 'dispute'}
          disabled={Boolean(myVote)}
          onClick={() => voteContribution(item.id, 'dispute')}
        >
          <Icon name="thumb-down" size={15} />
          {t('community.dispute')}
          <span className="vote-btn__count">({item.disputes})</span>
        </button>
        {item.mine && (
          <button
            type="button"
            className="vote-btn contrib__delete"
            onClick={() => deleteContribution(item.id)}
          >
            <Icon name="close" size={15} />
            {t('contrib.delete')}
          </button>
        )}
      </div>
    </article>
  )
}
