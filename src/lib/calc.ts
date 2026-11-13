import type { Allocation, AllocationPeriod, Habit, OneTimeCredit } from '../types'

export const MAX_MONTHS = 240

/**
 * Proration constant used to turn a calendar span into months of accrual.
 * A year is treated as 365.25 days so a "month" is 30.4375 days.
 */
export const DAYS_PER_MONTH = 365.25 / 12

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function monthlySaving(habit: Habit): number {
  if (habit.kind !== 'recurring') return 0
  return round2((habit.originalCost - habit.alternativeCost) * (habit.monthlyFrequency ?? 0))
}

export function oneTimeSaving(habit: Habit): number {
  if (habit.kind !== 'one-time') return 0
  return round2(habit.originalCost - habit.alternativeCost)
}

export interface PlanLine {
  habit: Habit
  monthly: number
  oneTime: number
}

export interface SavingsSummary {
  habits: Habit[]
  lines: PlanLine[]
  monthly: number
  oneTime: number
}

export interface PlanResult extends SavingsSummary {
  target: number
  horizonMonths: number
  monthsToTarget: number | null
  projectedAtHorizon: number
  remainingAtHorizon: number
  progress: number
  unlocked: boolean
}

export function projectedSavings(
  monthly: number,
  oneTime: number,
  months: number,
): number {
  return round2(monthly * months + oneTime)
}

/**
 * Earliest whole month at which projected savings reach the target.
 * Returns null when the target is not reachable within MAX_MONTHS.
 */
export function monthsToTarget(
  target: number,
  monthly: number,
  oneTime: number,
): number | null {
  if (target <= 0) return 1
  if (monthly <= 0) return oneTime >= target ? 1 : null

  let months = Math.max(1, Math.ceil((target - oneTime) / monthly))
  if (months > MAX_MONTHS) return null

  while (months < MAX_MONTHS && projectedSavings(monthly, oneTime, months) < target) {
    months += 1
  }
  while (months > 1 && projectedSavings(monthly, oneTime, months - 1) >= target) {
    months -= 1
  }

  return projectedSavings(monthly, oneTime, months) >= target ? months : null
}

export function summarizeSavings(habits: Habit[]): SavingsSummary {
  const unique = new Map(habits.map((habit) => [habit.id, habit]))
  const seenGroups = new Set<string>()

  // Defensive: never add two habits from the same overlap group, even if a
  // caller passes an unsanitised list (deep link, old localStorage entry).
  const selected = [...unique.values()].filter((habit) => {
    if (habit.exclusiveGroup) {
      if (seenGroups.has(habit.exclusiveGroup)) return false
      seenGroups.add(habit.exclusiveGroup)
    }
    return monthlySaving(habit) > 0 || oneTimeSaving(habit) > 0
  })

  const lines: PlanLine[] = selected.map((habit) => ({
    habit,
    monthly: monthlySaving(habit),
    oneTime: oneTimeSaving(habit),
  }))

  const monthly = round2(lines.reduce((total, line) => total + line.monthly, 0))
  const oneTime = round2(lines.reduce((total, line) => total + line.oneTime, 0))

  return { habits: selected, lines, monthly, oneTime }
}

/** Whole days elapsed between two ISO timestamps, clamped to >= 0. */
export function elapsedDays(fromIso: string, toIso: string): number {
  const start = Date.parse(fromIso)
  const end = Date.parse(toIso)
  if (Number.isNaN(start) || Number.isNaN(end)) return 0
  return Math.max(0, (end - start) / 86_400_000)
}

/**
 * Estimated recurring accumulation across allocation periods, prorated by day.
 * Closed periods stop accruing at their end; open periods accrue to `nowIso`.
 */
export function accumulatedRecurring(periods: AllocationPeriod[], nowIso: string): number {
  const nowMs = Date.parse(nowIso)
  const total = periods.reduce((sum, period) => {
    const startMs = Date.parse(period.start)
    if (Number.isNaN(startMs) || Number.isNaN(nowMs)) return sum
    const endMs = period.end ? Date.parse(period.end) : nowMs
    const clampedEnd = Number.isNaN(endMs) ? nowMs : Math.min(endMs, nowMs)
    const spanDays = Math.max(0, (clampedEnd - startMs) / 86_400_000)
    return sum + (period.monthly * spanDays) / DAYS_PER_MONTH
  }, 0)
  return round2(total)
}

/** Total one-time savings credited so far (counted once each). */
export function accumulatedOneTime(credits: OneTimeCredit[]): number {
  return round2(credits.reduce((sum, credit) => sum + credit.amount, 0))
}

export interface LifecycleProgress {
  /** Estimated accumulated savings (recurring + one-time). Confirmed excluded. */
  accumulated: number
  confirmed: number
  remaining: number
  /** Accumulated / target, clamped to 0..1. */
  progress: number
  monthly: number
  monthsRemaining: number | null
}

export function planProgress(
  target: number,
  allocations: Allocation[],
  periods: AllocationPeriod[],
  credits: OneTimeCredit[],
  confirmed: number,
  nowIso: string,
): LifecycleProgress {
  const recurring = accumulatedRecurring(periods, nowIso)
  const oneTime = accumulatedOneTime(credits)
  const accumulated = round2(recurring + oneTime)
  const remaining = Math.max(0, round2(target - accumulated))
  const monthly = round2(allocations.reduce((sum, allocation) => sum + allocation.monthly, 0))
  const safeTarget = target > 0 ? target : 1
  const progress = Math.min(1, Math.max(0, accumulated / safeTarget))
  const monthsRemaining = remaining <= 0 ? 0 : monthsToTarget(remaining, monthly, 0)

  return {
    accumulated,
    confirmed: round2(confirmed),
    remaining,
    progress,
    monthly,
    monthsRemaining,
  }
}

export interface CombinedTotals {
  activeCount: number
  accumulated: number
  target: number
  progress: number
}

/** Aggregates estimated progress across plans; progress never sums percentages. */
export function combinedTotals(
  items: Array<{ target: number; accumulated: number }>,
): CombinedTotals {
  const activeCount = items.length
  const accumulated = round2(items.reduce((sum, item) => sum + item.accumulated, 0))
  const target = round2(items.reduce((sum, item) => sum + item.target, 0))
  const safeTarget = target > 0 ? target : 1
  const progress = Math.min(1, Math.max(0, accumulated / safeTarget))
  return { activeCount, accumulated, target, progress }
}

export function calculatePlan(
  target: number,
  habits: Habit[],
  horizonMonths: number,
): PlanResult {
  const summary = summarizeSavings(habits)
  const { monthly, oneTime } = summary
  const months = monthsToTarget(target, monthly, oneTime)
  const projectedAtHorizon = projectedSavings(monthly, oneTime, horizonMonths)
  const safeTarget = target > 0 ? target : 1

  return {
    ...summary,
    target,
    horizonMonths,
    monthsToTarget: months,
    projectedAtHorizon,
    remainingAtHorizon: Math.max(0, round2(target - projectedAtHorizon)),
    progress: Math.min(1, projectedAtHorizon / safeTarget),
    unlocked: months !== null && months <= horizonMonths,
  }
}
