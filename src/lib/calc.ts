import type { Habit } from '../types'

export const MAX_MONTHS = 240

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
