import { DEFAULT_LOCALE, isLocale, type Locale } from '../i18n/types'
import type { SavedPlan } from '../types'

const KEY = 'tripswap:unlocks:v1'
const LOCALE_KEY = 'tripswap:locale:v2'
const SWAPS_KEY = 'tripswap:swaps:v1'

function isSavedPlan(value: unknown): value is SavedPlan {
  if (!value || typeof value !== 'object') return false
  const plan = value as Partial<SavedPlan>
  return (
    typeof plan.destinationId === 'string' &&
    Array.isArray(plan.habitIds) &&
    plan.habitIds.every((id) => typeof id === 'string') &&
    typeof plan.horizonMonths === 'number' &&
    typeof plan.savedAt === 'string'
  )
}

export function readPlans(): SavedPlan[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isSavedPlan)
  } catch {
    return []
  }
}

function writePlans(plans: SavedPlan[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(plans))
  } catch {
    // Storage can be unavailable (private mode, quota). The UI keeps working.
  }
}

export function savePlan(plan: SavedPlan): SavedPlan[] {
  const plans = readPlans().filter(
    (existing) => existing.destinationId !== plan.destinationId,
  )
  const next = [plan, ...plans]
  writePlans(next)
  return next
}

export function removePlan(destinationId: string): SavedPlan[] {
  const next = readPlans().filter((plan) => plan.destinationId !== destinationId)
  writePlans(next)
  return next
}

export function clearPlans(): void {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    // Ignore.
  }
}

export function getPlan(destinationId: string): SavedPlan | undefined {
  return readPlans().find((plan) => plan.destinationId === destinationId)
}

export function readLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  try {
    const raw = window.localStorage.getItem(LOCALE_KEY)
    return isLocale(raw) ? raw : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

export function writeLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(LOCALE_KEY, locale)
  } catch {
    // Storage can be unavailable; the toggle still works in memory.
  }
}

export function readSwapSelection(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(SWAPS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is string => typeof id === 'string')
  } catch {
    return []
  }
}

export function writeSwapSelection(ids: string[]): void {
  try {
    window.localStorage.setItem(SWAPS_KEY, JSON.stringify(ids))
  } catch {
    // Ignore.
  }
}
