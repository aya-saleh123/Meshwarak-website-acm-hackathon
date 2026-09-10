import { useId, useState } from 'react'
import { Modal } from './Modal'
import { Icon } from './Icon'
import { Button } from './Button'
import { Notice } from './Notice'
import { useApp } from '../context/AppContext'
import { CONTRIBUTION_TYPES, WAIT_BUCKETS } from '../lib/community'
import { AREAS } from '../data/areas'
import type { ContributionType } from '../lib/types'
import type { StringKey } from '../i18n/strings'

export function ContributionModal({
  serviceId,
  initialType = 'document',
  onClose,
}: {
  serviceId: string
  initialType?: ContributionType
  onClose: () => void
}) {
  const { t, lang, areaId, addContribution } = useApp()
  const [type, setType] = useState<ContributionType>(initialType)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [waitBucket, setWaitBucket] = useState<string | null>(null)
  const [area, setArea] = useState<string>(areaId ?? '')
  const [error, setError] = useState<string | null>(null)

  const titleId = useId()
  const bodyId = useId()
  const areaSelectId = useId()
  const isWait = type === 'wait'

  function submit() {
    if (isWait) {
      if (!waitBucket) {
        setError(t('contrib.errorWait'))
        return
      }
    } else if (title.trim().length < 3) {
      setError(t('contrib.errorTitle'))
      return
    }

    if (!isWait && body.trim().length < 10) {
      setError(t('contrib.errorBody'))
      return
    }

    const bucket = WAIT_BUCKETS.find((item) => item.id === waitBucket)
    addContribution({
      serviceId,
      areaId: area || undefined,
      type,
      title: isWait
        ? `${t('contrib.waitLabel')} ${bucket ? (lang === 'ar' ? bucket.ar : bucket.en) : ''}`.trim()
        : title,
      content: body,
    })
    onClose()
  }

  return (
    <Modal
      title={t('contrib.title')}
      subtitle={t('contrib.privacy')}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t('contrib.cancel')}
          </Button>
          <Button onClick={submit}>
            <Icon name="plus" size={16} />
            {t('contrib.submit')}
          </Button>
        </>
      }
    >
      <div className="field">
        <span className="field__label">{t('contrib.typeLabel')}</span>
        <div className="option-grid">
          {CONTRIBUTION_TYPES.map((item) => (
            <button
              key={item}
              type="button"
              className="option-btn"
              aria-pressed={type === item}
              onClick={() => {
                setType(item)
                setError(null)
              }}
            >
              <Icon
                name={
                  item === 'wait'
                    ? 'clock'
                    : item === 'place'
                      ? 'pin'
                      : item === 'hours'
                        ? 'clock'
                        : item === 'step'
                          ? 'list'
                          : item === 'tip'
                            ? 'info'
                            : 'folder'
                }
                size={15}
              />
              {t(`community.type.${item}` as StringKey)}
            </button>
          ))}
        </div>
      </div>

      {isWait ? (
        <div className="field">
          <span className="field__label">{t('contrib.waitLabel')}</span>
          <div className="option-grid">
            {WAIT_BUCKETS.map((bucket) => (
              <button
                key={bucket.id}
                type="button"
                className="option-btn"
                aria-pressed={waitBucket === bucket.id}
                onClick={() => {
                  setWaitBucket(bucket.id)
                  setError(null)
                }}
              >
                <Icon name="clock" size={15} />
                {lang === 'ar' ? bucket.ar : bucket.en}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="field">
          <label className="field__label" htmlFor={titleId}>
            {t('contrib.titleLabel')}
          </label>
          <input
            id={titleId}
            className="input"
            value={title}
            maxLength={90}
            placeholder={t('contrib.titlePlaceholder')}
            onChange={(event) => {
              setTitle(event.target.value)
              setError(null)
            }}
          />
        </div>
      )}

      <div className="field">
        <label className="field__label" htmlFor={bodyId}>
          {t('contrib.bodyLabel')}
          {isWait && (
            <span className="text-muted"> ({t('common.optional')})</span>
          )}
        </label>
        <textarea
          id={bodyId}
          className="textarea"
          value={body}
          maxLength={600}
          placeholder={t('contrib.bodyPlaceholder')}
          onChange={(event) => {
            setBody(event.target.value)
            setError(null)
          }}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor={areaSelectId}>
          {t('contrib.areaLabel')}
        </label>
        <div className="select-wrap">
          <select
            id={areaSelectId}
            className="select"
            value={area}
            onChange={(event) => setArea(event.target.value)}
          >
            <option value="">{t('place.chooseArea')}</option>
            {AREAS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nameAr}
              </option>
            ))}
          </select>
          <Icon name="chevron" size={16} />
        </div>
      </div>

      {error && (
        <p className="field__error" role="alert">
          <Icon name="alert" size={15} />
          {error}
        </p>
      )}

      <Notice tone="info">{t('community.localNote')}</Notice>
    </Modal>
  )
}
