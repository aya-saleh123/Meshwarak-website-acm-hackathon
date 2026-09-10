import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STRINGS, type Lang, type StringKey } from '../i18n/strings'
import { readJson, writeJson } from '../lib/storage'
import {
  createContribution,
  getContributorId,
  loadContributions,
  saveContributions,
  type NewContribution,
} from '../lib/community'
import type { Contribution } from '../lib/types'

type Theme = 'light' | 'dark'
type GeoState = 'idle' | 'loading' | 'ready' | 'denied' | 'error' | 'unsupported'

export interface Toast {
  id: number
  message: string
  tone: 'success' | 'info' | 'error'
}

interface AppValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** `t('key')`, or `t('key', { count: 3 })` to fill `{count}` placeholders. */
  t: (key: StringKey, vars?: Record<string, string | number>) => string
  dir: 'rtl' | 'ltr'

  theme: Theme
  setTheme: (theme: Theme) => void

  areaId: string | null
  setAreaId: (id: string | null) => void

  userPosition: { lat: number; lng: number } | null
  geoState: GeoState
  requestLocation: () => void

  contributions: Contribution[]
  addContribution: (input: NewContribution) => void
  voteContribution: (id: string, vote: 'confirm' | 'dispute') => void
  deleteContribution: (id: string) => void

  toast: Toast | null
  showToast: (message: string, tone?: Toast['tone']) => void
  dismissToast: () => void

  resetLocalData: () => void
}

const AppContext = createContext<AppValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => readJson<Lang>('lang', 'ar'))
  const [theme, setThemeState] = useState<Theme>(() =>
    readJson<Theme>('theme', 'light'),
  )
  const [areaId, setAreaIdState] = useState<string | null>(() =>
    readJson<string | null>('area', null),
  )
  const [userPosition, setUserPosition] = useState<AppValue['userPosition']>(null)
  const [geoState, setGeoState] = useState<GeoState>('idle')
  const [contributions, setContributions] = useState<Contribution[]>(() =>
    loadContributions(),
  )
  const [toast, setToast] = useState<Toast | null>(null)

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = dir
    root.dataset.theme = theme
  }, [lang, dir, theme])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    writeJson('lang', next)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    writeJson('theme', next)
  }, [])

  const setAreaId = useCallback((next: string | null) => {
    setAreaIdState(next)
    writeJson('area', next)
  }, [])

  const showToast = useCallback(
    (message: string, tone: Toast['tone'] = 'success') => {
      setToast({ id: Date.now(), message, tone })
    },
    [],
  )

  const dismissToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const t = useCallback(
    (key: StringKey, vars?: Record<string, string | number>) => {
      const template = STRINGS[lang][key] ?? key
      if (!vars) return template
      return template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in vars ? String(vars[name]) : match,
      )
    },
    [lang],
  )

  /**
   * Geolocation is requested only on an explicit user action, used to compute
   * the nearest district in-browser, and never persisted or transmitted.
   */
  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeoState('unsupported')
      showToast(STRINGS[lang]['place.geoUnsupported'], 'error')
      return
    }
    setGeoState('loading')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setGeoState('ready')
      },
      (error) => {
        const denied = error.code === error.PERMISSION_DENIED
        setGeoState(denied ? 'denied' : 'error')
        showToast(
          STRINGS[lang][denied ? 'place.geoDenied' : 'place.geoError'],
          'info',
        )
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  }, [lang, showToast])

  const persist = useCallback((items: Contribution[]) => {
    setContributions(items)
    saveContributions(items)
  }, [])

  const addContribution = useCallback(
    (input: NewContribution) => {
      const next = [createContribution(input), ...contributions]
      persist(next)
      showToast(STRINGS[lang]['contrib.success'])
    },
    [contributions, lang, persist, showToast],
  )

  const voteContribution = useCallback(
    (id: string, vote: 'confirm' | 'dispute') => {
      const contributorId = getContributorId()
      const next = contributions.map((item) => {
        if (item.id !== id) return item
        if (item.votedBy[contributorId]) return item
        return {
          ...item,
          confirmations: item.confirmations + (vote === 'confirm' ? 1 : 0),
          disputes: item.disputes + (vote === 'dispute' ? 1 : 0),
          votedBy: { ...item.votedBy, [contributorId]: vote },
        }
      })
      persist(next)
      showToast(STRINGS[lang]['community.voted'], 'info')
    },
    [contributions, lang, persist, showToast],
  )

  const deleteContribution = useCallback(
    (id: string) => {
      persist(contributions.filter((item) => item.id !== id))
    },
    [contributions, persist],
  )

  const resetLocalData = useCallback(() => {
    try {
      const keys: string[] = []
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i)
        if (key?.startsWith('me4warak:')) keys.push(key)
      }
      keys.forEach((key) => window.localStorage.removeItem(key))
    } catch {
      /* ignore */
    }
    setContributions([])
    setAreaIdState(null)
    showToast(STRINGS[lang]['settings.resetDone'], 'info')
  }, [lang, showToast])

  const value = useMemo<AppValue>(
    () => ({
      lang,
      setLang,
      t,
      dir,
      theme,
      setTheme,
      areaId,
      setAreaId,
      userPosition,
      geoState,
      requestLocation,
      contributions,
      addContribution,
      voteContribution,
      deleteContribution,
      toast,
      showToast,
      dismissToast,
      resetLocalData,
    }),
    [
      lang,
      setLang,
      t,
      dir,
      theme,
      setTheme,
      areaId,
      setAreaId,
      userPosition,
      geoState,
      requestLocation,
      contributions,
      addContribution,
      voteContribution,
      deleteContribution,
      toast,
      showToast,
      dismissToast,
      resetLocalData,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppValue {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside <AppProvider>')
  return context
}
