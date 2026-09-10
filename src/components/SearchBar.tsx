import { useId, type FormEvent } from 'react'
import { Icon } from './Icon'
import { Button } from './Button'
import { useApp } from '../context/AppContext'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  /** When provided the bar becomes a form (used on the homepage hero). */
  onSubmit?: () => void
  label: string
  placeholder: string
  size?: 'md' | 'lg'
  /** Show a submit button next to the field. */
  withAction?: boolean
  autoFocus?: boolean
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  label,
  placeholder,
  size = 'md',
  withAction = false,
  autoFocus = false,
}: SearchBarProps) {
  const id = useId()
  const { t } = useApp()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit?.()
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`searchbar${size === 'lg' ? ' searchbar--lg' : ''}`}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Icon name="search" size={20} className="searchbar__icon" />
      <input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button
          type="button"
          className="searchbar__clear"
          onClick={() => onChange('')}
          aria-label={t('services.clear')}
        >
          <Icon name="close" size={18} />
        </button>
      )}
      {withAction && (
        <Button type="submit" size={size === 'lg' ? 'md' : 'sm'}>
          {t('home.hero.searchAction')}
        </Button>
      )}
    </form>
  )
}
