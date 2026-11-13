import type { Habit } from '../types'

export type AllocationConflictKind = 'same-activity' | 'same-group' | 'one-time-credited'

export interface AllocationConflict {
  habitId: string
  kind: AllocationConflictKind
  otherDestinationId: string
  otherHabitId: string
}

export interface ReservedAllocation {
  destinationId: string
  allocatedHabitIds: string[]
}

/**
 * Cross-plan conflicts for activating (or extending) a plan with `candidateIds`
 * into `destinationId`. A plan editing itself is never a conflict with itself.
 *
 * - same-activity: a candidate is already allocated in another plan.
 * - same-group: a candidate shares an `exclusiveGroup` with a habit allocated
 *   in another plan (the same underlying spending cannot fund two plans).
 * - one-time-credited: a one-time candidate was already credited (used) once.
 */
export function findActivationConflicts(
  candidateIds: string[],
  destinationId: string,
  reserved: ReservedAllocation[],
  creditedHabitIds: string[],
  allHabits: Habit[],
): AllocationConflict[] {
  const byId = new Map(allHabits.map((habit) => [habit.id, habit]))
  const conflicts: AllocationConflict[] = []

  for (const candidateId of candidateIds) {
    const candidate = byId.get(candidateId)
    if (!candidate) continue

    for (const other of reserved) {
      if (other.destinationId === destinationId) continue

      if (other.allocatedHabitIds.includes(candidateId)) {
        conflicts.push({
          habitId: candidateId,
          kind: 'same-activity',
          otherDestinationId: other.destinationId,
          otherHabitId: candidateId,
        })
        continue
      }

      if (candidate.exclusiveGroup) {
        const otherHabit = other.allocatedHabitIds
          .map((id) => byId.get(id))
          .find((habit) => habit && habit.exclusiveGroup === candidate.exclusiveGroup)
        if (otherHabit) {
          conflicts.push({
            habitId: candidateId,
            kind: 'same-group',
            otherDestinationId: other.destinationId,
            otherHabitId: otherHabit.id,
          })
        }
      }
    }

    if (candidate.kind === 'one-time' && creditedHabitIds.includes(candidateId)) {
      conflicts.push({
        habitId: candidateId,
        kind: 'one-time-credited',
        otherDestinationId: '',
        otherHabitId: candidateId,
      })
    }
  }

  return conflicts
}
