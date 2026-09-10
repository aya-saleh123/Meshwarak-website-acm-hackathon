/**
 * Small localStorage helpers.
 *
 * Everything me4warak persists is created by the user inside the app
 * (theme, chosen district, checklist ticks, their own contributions).
 * No device, network or personal data is read or stored.
 */

const PREFIX = 'me4warak:'

export function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(PREFIX + key)
    if (!value) return fallback
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* storage disabled (private mode) — the app still works in-memory */
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key)
  } catch {
    /* ignore */
  }
}
