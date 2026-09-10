import { useCallback, useMemo, useState } from 'react'
import { readJson, writeJson } from '../lib/storage'

type Checked = Record<string, boolean>

/** Per-service document checklist, persisted on the user's own device. */
export function useChecklist(serviceId: string, documentIds: string[]) {
  const key = `checklist:${serviceId}`
  const [checked, setChecked] = useState<Checked>(() => readJson<Checked>(key, {}))

  const persist = useCallback(
    (next: Checked) => {
      setChecked(next)
      writeJson(key, next)
    },
    [key],
  )

  const toggle = useCallback(
    (id: string) => {
      persist({ ...checked, [id]: !checked[id] })
    },
    [checked, persist],
  )

  const reset = useCallback(() => persist({}), [persist])

  const { done, total, percent, complete } = useMemo(() => {
    const totalCount = documentIds.length
    const doneCount = documentIds.filter((id) => checked[id]).length
    return {
      done: doneCount,
      total: totalCount,
      percent: totalCount ? Math.round((doneCount / totalCount) * 100) : 0,
      complete: totalCount > 0 && doneCount === totalCount,
    }
  }, [checked, documentIds])

  return { checked, toggle, reset, done, total, percent, complete }
}
