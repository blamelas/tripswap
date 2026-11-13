import type { Habit, PlanLifecycle, SavedPlan } from '../types'
import { monthlySaving, oneTimeSaving, round2 } from './calc'

/**
 * Pure, immutable lifecycle transitions. All money snapshots come from calc;
 * no arithmetic is duplicated here.
 */

/**
 * saved -> active. Snapshots each positive-saving habit: recurring habits get
 * one Allocation plus one open AllocationPeriod, one-time habits get one
 * OneTimeCredit. Zero-saving habits are skipped.
 */
export function activate(
  plan: SavedPlan,
  selectedHabits: Habit[],
  nowIso: string,
): PlanLifecycle {
  const allocations: PlanLifecycle['allocations'] = []
  const periods: PlanLifecycle['periods'] = []
  const oneTimeCredits: PlanLifecycle['oneTimeCredits'] = []

  for (const habit of selectedHabits) {
    if (habit.kind === 'recurring') {
      const monthly = monthlySaving(habit)
      if (monthly <= 0) continue
      allocations.push({ habitId: habit.id, monthly, allocatedAt: nowIso })
      periods.push({ habitId: habit.id, monthly, start: nowIso, end: null })
    } else {
      const amount = oneTimeSaving(habit)
      if (amount <= 0) continue
      oneTimeCredits.push({
        habitId: habit.id,
        amount,
        creditedAt: nowIso,
        destinationId: plan.destinationId,
      })
    }
  }

  return {
    status: 'active',
    activatedAt: nowIso,
    achievedAt: null,
    allocations,
    periods,
    oneTimeCredits,
    confirmed: 0,
  }
}

/** active -> paused. Closes every open period at now. */
export function pause(lifecycle: PlanLifecycle, nowIso: string): PlanLifecycle {
  return {
    ...lifecycle,
    status: 'paused',
    periods: lifecycle.periods.map((period) =>
      period.end === null ? { ...period, end: nowIso } : period,
    ),
  }
}

/** paused -> active. Opens a fresh period per allocation at now (no backfill). */
export function resume(lifecycle: PlanLifecycle, nowIso: string): PlanLifecycle {
  const opened: PlanLifecycle['periods'] = lifecycle.allocations.map((allocation) => ({
    habitId: allocation.habitId,
    monthly: allocation.monthly,
    start: nowIso,
    end: null,
  }))
  return {
    ...lifecycle,
    status: 'active',
    periods: [...lifecycle.periods, ...opened],
  }
}

/** active/paused -> achieved. Explicit only; closes open periods and stamps achievedAt. */
export function achieve(lifecycle: PlanLifecycle, nowIso: string): PlanLifecycle {
  return {
    ...lifecycle,
    status: 'achieved',
    achievedAt: nowIso,
    periods: lifecycle.periods.map((period) =>
      period.end === null ? { ...period, end: nowIso } : period,
    ),
  }
}

/**
 * Adds a habit to an active plan. Recurring habits open a period now; one-time
 * habits add a credit. `destinationId` is required for the credit record.
 */
export function allocate(
  lifecycle: PlanLifecycle,
  habit: Habit,
  destinationId: string,
  nowIso: string,
): PlanLifecycle {
  const allocations = [...lifecycle.allocations]
  const periods = [...lifecycle.periods]
  const oneTimeCredits = [...lifecycle.oneTimeCredits]

  if (habit.kind === 'recurring') {
    const monthly = monthlySaving(habit)
    if (monthly > 0) {
      allocations.push({ habitId: habit.id, monthly, allocatedAt: nowIso })
      periods.push({ habitId: habit.id, monthly, start: nowIso, end: null })
    }
  } else {
    const amount = oneTimeSaving(habit)
    if (amount > 0) {
      oneTimeCredits.push({
        habitId: habit.id,
        amount,
        creditedAt: nowIso,
        destinationId,
      })
    }
  }

  return { ...lifecycle, allocations, periods, oneTimeCredits }
}

/**
 * Removes an allocation: closes its open period (if any) and drops the
 * allocation, keeping closed periods as history. A matching one-time credit is
 * also released so the habit becomes available again.
 */
export function releaseAllocation(
  lifecycle: PlanLifecycle,
  habitId: string,
  nowIso: string,
): PlanLifecycle {
  return {
    ...lifecycle,
    allocations: lifecycle.allocations.filter((a) => a.habitId !== habitId),
    periods: lifecycle.periods.map((period) =>
      period.habitId === habitId && period.end === null
        ? { ...period, end: nowIso }
        : period,
    ),
    oneTimeCredits: lifecycle.oneTimeCredits.filter((credit) => credit.habitId !== habitId),
  }
}

/** Adds a user-confirmed amount (kept separate from estimated accumulation). */
export function addConfirmed(lifecycle: PlanLifecycle, amount: number): PlanLifecycle {
  return {
    ...lifecycle,
    confirmed: round2(lifecycle.confirmed + amount),
  }
}
