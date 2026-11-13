import type { Habit } from '../types'

/**
 * Overlaps are modelled as exclusive groups: two habits that assume the same
 * underlying spending cannot be added together. Selecting one replaces the
 * other instead of double counting the savings.
 */
export function conflictWith(
  selectedIds: string[],
  habit: Habit,
  allHabits: Habit[],
): Habit | undefined {
  if (!habit.exclusiveGroup) return undefined
  return allHabits.find(
    (other) =>
      other.id !== habit.id &&
      other.exclusiveGroup === habit.exclusiveGroup &&
      selectedIds.includes(other.id),
  )
}

export function toggleHabit(
  selectedIds: string[],
  habit: Habit,
  allHabits: Habit[],
): string[] {
  if (selectedIds.includes(habit.id)) {
    return selectedIds.filter((id) => id !== habit.id)
  }

  const next = new Set(selectedIds)
  if (habit.exclusiveGroup) {
    for (const other of allHabits) {
      if (other.id !== habit.id && other.exclusiveGroup === habit.exclusiveGroup) {
        next.delete(other.id)
      }
    }
  }
  next.add(habit.id)
  return [...next]
}

/** Drops unknown ids and keeps at most one habit per exclusive group. */
export function sanitizeSelection(ids: string[], allHabits: Habit[]): string[] {
  const byId = new Map(allHabits.map((habit) => [habit.id, habit]))
  const seenGroups = new Set<string>()
  const cleaned: string[] = []

  for (const id of ids) {
    const habit = byId.get(id)
    if (!habit) continue
    if (habit.exclusiveGroup) {
      if (seenGroups.has(habit.exclusiveGroup)) continue
      seenGroups.add(habit.exclusiveGroup)
    }
    cleaned.push(id)
  }

  return cleaned
}
