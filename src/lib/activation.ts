import type { Habit } from '../types'
import { HABITS } from '../data/habits'
import type { AllocationConflict } from './allocations'
import { findActivationConflicts } from './allocations'
import {
  getCreditedHabitIds,
  getReservedAllocations,
  removeAllocation,
  startPlan,
} from './storage'

/**
 * Activation orchestration shared by DestinationDetail and the Saved section of
 * My plans. Conflict detection and storage mutations stay in their own modules;
 * this only wires them together so the transfer semantics live in one place.
 */

/** Conflicts between `candidateHabits` and habits already reserved elsewhere. */
export function pendingActivationConflicts(
  candidateHabits: Habit[],
  destinationId: string,
): AllocationConflict[] {
  return findActivationConflicts(
    candidateHabits.map((habit) => habit.id),
    destinationId,
    getReservedAllocations(),
    getCreditedHabitIds(),
    HABITS,
  )
}

export interface ActivationDecision {
  habitId: string
  transfer: boolean
}

/**
 * Starts a plan after resolving conflicts. A `transfer` decision releases the
 * conflicting recurring habit from its other plan (closing its period, keeping
 * history) and then activates it here; anything not transferred is kept out of
 * this plan. One-time credits are permanent history: they are never moved or
 * credited twice, so a one-time conflict always stays with the other plan.
 */
export function executeActivation(
  destinationId: string,
  candidateHabits: Habit[],
  conflicts: AllocationConflict[],
  decisions: ActivationDecision[],
  nowIso: string,
): void {
  const transferByHabit = new Set(
    decisions.filter((decision) => decision.transfer).map((decision) => decision.habitId),
  )
  const keepIds = new Set(candidateHabits.map((habit) => habit.id))

  for (const conflict of conflicts) {
    if (
      conflict.kind === 'one-time-credited' ||
      !transferByHabit.has(conflict.habitId)
    ) {
      keepIds.delete(conflict.habitId)
      continue
    }

    if (conflict.otherDestinationId) {
      removeAllocation(
        conflict.otherDestinationId,
        conflict.otherHabitId,
        nowIso,
      )
    }
  }

  startPlan(
    destinationId,
    candidateHabits.filter((habit) => keepIds.has(habit.id)),
    nowIso,
  )
}
