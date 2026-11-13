import { DEFAULT_LOCALE, isLocale, type Locale } from '../i18n/types'
import type {
  Allocation,
  AllocationPeriod,
  GamesEstimate,
  Habit,
  LifecycleStatus,
  OneTimeCredit,
  PlanLifecycle,
  SavedPlan,
} from '../types'
import type { ReservedAllocation } from './allocations'
import { HABITS, getHabit } from '../data/habits'
import { findActivationConflicts } from './allocations'
import {
  achieve,
  activate,
  addConfirmed,
  allocate,
  pause,
  releaseAllocation,
  resume,
} from './lifecycle'

const V1_KEY = 'tripswap:unlocks:v1'
const V2_KEY = 'tripswap:plans:v2'
const LOCALE_KEY = 'tripswap:locale:v2'
const GAMES_KEY = 'tripswap:games:v1'
const SWAPS_KEY = 'tripswap:swaps:v1'

function isGamesEstimate(value: unknown): value is GamesEstimate {
  if (!value || typeof value !== 'object') return false
  const estimate = value as Partial<GamesEstimate>
  return (
    typeof estimate.current === 'number' &&
    Number.isFinite(estimate.current) &&
    estimate.current >= 0 &&
    typeof estimate.reduced === 'number' &&
    Number.isFinite(estimate.reduced) &&
    estimate.reduced >= 0
  )
}

function isLifecycleStatus(value: unknown): value is LifecycleStatus {
  return value === 'saved' || value === 'active' || value === 'paused' || value === 'achieved'
}

function isAllocation(value: unknown): value is Allocation {
  if (!value || typeof value !== 'object') return false
  const allocation = value as Partial<Allocation>
  return (
    typeof allocation.habitId === 'string' &&
    typeof allocation.monthly === 'number' &&
    Number.isFinite(allocation.monthly) &&
    typeof allocation.allocatedAt === 'string'
  )
}

function isAllocationPeriod(value: unknown): value is AllocationPeriod {
  if (!value || typeof value !== 'object') return false
  const period = value as Partial<AllocationPeriod>
  return (
    typeof period.habitId === 'string' &&
    typeof period.monthly === 'number' &&
    Number.isFinite(period.monthly) &&
    typeof period.start === 'string' &&
    (period.end === null || typeof period.end === 'string')
  )
}

function isOneTimeCredit(value: unknown): value is OneTimeCredit {
  if (!value || typeof value !== 'object') return false
  const credit = value as Partial<OneTimeCredit>
  return (
    typeof credit.habitId === 'string' &&
    typeof credit.amount === 'number' &&
    Number.isFinite(credit.amount) &&
    typeof credit.creditedAt === 'string' &&
    typeof credit.destinationId === 'string'
  )
}

function isPlanLifecycle(value: unknown): value is PlanLifecycle {
  if (!value || typeof value !== 'object') return false
  const lifecycle = value as Partial<PlanLifecycle>
  return (
    isLifecycleStatus(lifecycle.status) &&
    (lifecycle.activatedAt === null || typeof lifecycle.activatedAt === 'string') &&
    (lifecycle.achievedAt === null || typeof lifecycle.achievedAt === 'string') &&
    Array.isArray(lifecycle.allocations) &&
    lifecycle.allocations.every(isAllocation) &&
    Array.isArray(lifecycle.periods) &&
    lifecycle.periods.every(isAllocationPeriod) &&
    Array.isArray(lifecycle.oneTimeCredits) &&
    lifecycle.oneTimeCredits.every(isOneTimeCredit) &&
    typeof lifecycle.confirmed === 'number' &&
    Number.isFinite(lifecycle.confirmed)
  )
}

/**
 * Validates a stored plan's base shape. A malformed lifecycle is coerced to
 * undefined (the plan becomes "saved") rather than dropping the plan.
 */
function normalizePlan(value: unknown): SavedPlan | null {
  if (!value || typeof value !== 'object') return null
  const plan = value as Partial<SavedPlan>
  if (
    typeof plan.destinationId !== 'string' ||
    !Array.isArray(plan.habitIds) ||
    !plan.habitIds.every((id) => typeof id === 'string') ||
    typeof plan.horizonMonths !== 'number' ||
    typeof plan.savedAt !== 'string' ||
    (plan.gamesEstimate !== undefined && !isGamesEstimate(plan.gamesEstimate))
  ) {
    return null
  }

  const normalized: SavedPlan = {
    destinationId: plan.destinationId,
    habitIds: plan.habitIds,
    horizonMonths: plan.horizonMonths,
    savedAt: plan.savedAt,
  }
  if (plan.gamesEstimate !== undefined) normalized.gamesEstimate = plan.gamesEstimate
  if (plan.lifecycle !== undefined && isPlanLifecycle(plan.lifecycle)) {
    normalized.lifecycle = plan.lifecycle
  }
  return normalized
}

function isPlanEnvelope(value: unknown): value is { version: 2; plans: unknown[] } {
  if (!value || typeof value !== 'object') return false
  const envelope = value as { version?: unknown; plans?: unknown }
  return envelope.version === 2 && Array.isArray(envelope.plans)
}

function dedupeByDestination(plans: SavedPlan[]): SavedPlan[] {
  const byDestination = new Map<string, SavedPlan>()
  for (const plan of plans) byDestination.set(plan.destinationId, plan)
  return [...byDestination.values()]
}

export function readPlans(): SavedPlan[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(V2_KEY)
    if (raw) {
      try {
        const parsed: unknown = JSON.parse(raw)
        if (isPlanEnvelope(parsed)) {
          return parsed.plans
            .map(normalizePlan)
            .filter((plan): plan is SavedPlan => plan !== null)
        }
      } catch {
        // Corrupt v2 is not fatal: fall through to the legacy key.
      }
    }
  } catch {
    return []
  }

  try {
    const legacy = window.localStorage.getItem(V1_KEY)
    if (!legacy) return []
    const parsed: unknown = JSON.parse(legacy)
    if (!Array.isArray(parsed)) return []
    const plans = dedupeByDestination(
      parsed.map(normalizePlan).filter((plan): plan is SavedPlan => plan !== null),
    )
    writePlans(plans)
    return plans
  } catch {
    return []
  }
}

function writePlans(plans: SavedPlan[]): void {
  try {
    window.localStorage.setItem(V2_KEY, JSON.stringify({ version: 2, plans }))
  } catch {
    // Storage can be unavailable (private mode, quota). The UI keeps working.
  }
}

export function savePlan(plan: SavedPlan): SavedPlan[] {
  const plans = readPlans()
  const existing = plans.find((p) => p.destinationId === plan.destinationId)
  const merged: SavedPlan = {
    destinationId: plan.destinationId,
    habitIds: plan.habitIds,
    horizonMonths: plan.horizonMonths,
    savedAt: plan.savedAt,
    ...(plan.gamesEstimate !== undefined ? { gamesEstimate: plan.gamesEstimate } : {}),
    ...(existing?.lifecycle !== undefined ? { lifecycle: existing.lifecycle } : {}),
  }
  const next = [merged, ...plans.filter((p) => p.destinationId !== plan.destinationId)]
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
    window.localStorage.removeItem(V2_KEY)
    // Also drop the legacy key so a stale v1 record cannot re-migrate after a wipe.
    window.localStorage.removeItem(V1_KEY)
  } catch {
    // Ignore.
  }
}

export function getPlan(destinationId: string): SavedPlan | undefined {
  return readPlans().find((plan) => plan.destinationId === destinationId)
}

function mutatePlan(
  destinationId: string,
  mutate: (plan: SavedPlan) => SavedPlan,
): SavedPlan[] {
  const next = readPlans().map((plan) =>
    plan.destinationId === destinationId ? mutate(plan) : plan,
  )
  writePlans(next)
  return next
}

/** saved -> active. Reserves the selected habits (no-op if already activated). */
export function startPlan(
  destinationId: string,
  selectedHabits: Habit[],
  nowIso: string,
): SavedPlan[] {
  return mutatePlan(destinationId, (plan) => {
    if (plan.lifecycle && plan.lifecycle.status !== 'saved') return plan
    const lifecycle = activate(plan, selectedHabits, nowIso)
    const funded = new Set([
      ...lifecycle.allocations.map((allocation) => allocation.habitId),
      ...lifecycle.oneTimeCredits.map((credit) => credit.habitId),
    ])
    return {
      ...plan,
      // The saved selection mirrors what the plan actually funds, so a
      // "keep with the other plan" decision cannot leave phantom swaps behind.
      habitIds: selectedHabits
        .map((habit) => habit.id)
        .filter((id) => funded.has(id)),
      lifecycle,
    }
  })
}

export function pausePlan(destinationId: string, nowIso: string): SavedPlan[] {
  return mutatePlan(destinationId, (plan) =>
    plan.lifecycle ? { ...plan, lifecycle: pause(plan.lifecycle, nowIso) } : plan,
  )
}

export function resumePlan(destinationId: string, nowIso: string): SavedPlan[] {
  return mutatePlan(destinationId, (plan) =>
    plan.lifecycle ? { ...plan, lifecycle: resume(plan.lifecycle, nowIso) } : plan,
  )
}

export function achievePlan(destinationId: string, nowIso: string): SavedPlan[] {
  return mutatePlan(destinationId, (plan) =>
    plan.lifecycle ? { ...plan, lifecycle: achieve(plan.lifecycle, nowIso) } : plan,
  )
}

export function addAllocation(
  destinationId: string,
  habit: Habit,
  nowIso: string,
): SavedPlan[] {
  return mutatePlan(destinationId, (plan) => {
    if (!plan.lifecycle) return plan

    // Defensive: one habit per overlap group, even if a caller bypasses the UI.
    const alreadyAllocated = plan.lifecycle.allocations.some(
      (allocation) => allocation.habitId === habit.id,
    )
    const clashesGroup =
      habit.exclusiveGroup !== undefined &&
      plan.lifecycle.allocations.some(
        (allocation) =>
          getHabit(allocation.habitId)?.exclusiveGroup === habit.exclusiveGroup,
      )
    if (alreadyAllocated || clashesGroup) return plan

    // Defensive: never reserve a swap that another active plan already funds.
    const conflicts = findActivationConflicts(
      [habit.id],
      destinationId,
      getReservedAllocations(),
      getCreditedHabitIds(),
      HABITS,
    )
    if (conflicts.length > 0) return plan

    return {
      ...plan,
      habitIds: plan.habitIds.includes(habit.id)
        ? plan.habitIds
        : [...plan.habitIds, habit.id],
      lifecycle: allocate(plan.lifecycle, habit, destinationId, nowIso),
    }
  })
}

export function removeAllocation(
  destinationId: string,
  habitId: string,
  nowIso: string,
): SavedPlan[] {
  return mutatePlan(destinationId, (plan) =>
    plan.lifecycle
      ? {
          ...plan,
          // The selection follows the allocation so the saved plan and the
          // deep link never advertise a swap this plan is not funding.
          habitIds: plan.habitIds.filter((id) => id !== habitId),
          lifecycle: releaseAllocation(plan.lifecycle, habitId, nowIso),
        }
      : plan,
  )
}

export function confirmAmount(destinationId: string, amount: number): SavedPlan[] {
  return mutatePlan(destinationId, (plan) =>
    plan.lifecycle ? { ...plan, lifecycle: addConfirmed(plan.lifecycle, amount) } : plan,
  )
}

export function getReservedAllocations(): ReservedAllocation[] {
  const reserved: ReservedAllocation[] = []
  for (const plan of readPlans()) {
    const status = plan.lifecycle?.status
    // Achieved plans are closed: their recurring swaps may fund a new plan.
    if (status !== 'active' && status !== 'paused') continue
    const allocations = plan.lifecycle?.allocations
    if (!allocations || allocations.length === 0) continue
    reserved.push({
      destinationId: plan.destinationId,
      allocatedHabitIds: allocations.map((allocation) => allocation.habitId),
    })
  }
  return reserved
}

export function getCreditedHabitIds(): string[] {
  const credited = new Set<string>()
  for (const plan of readPlans()) {
    for (const credit of plan.lifecycle?.oneTimeCredits ?? []) {
      credited.add(credit.habitId)
    }
  }
  return [...credited]
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

export function readGamesEstimate(): GamesEstimate | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(GAMES_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isGamesEstimate(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function writeGamesEstimate(estimate: GamesEstimate): void {
  try {
    window.localStorage.setItem(GAMES_KEY, JSON.stringify(estimate))
  } catch {
    // Ignore.
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
