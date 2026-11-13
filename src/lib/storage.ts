import type { SavedPlan } from '../types'

const KEY = 'tripswap:unlocks:v1'

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
