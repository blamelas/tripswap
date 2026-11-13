import { describe, expect, it } from 'vitest'
import { findActivationConflicts } from '../src/lib/allocations'
import { HABITS, getHabit } from '../src/data/habits'
import type { ReservedAllocation } from '../src/lib/allocations'

describe('findActivationConflicts', () => {
  it('flags a candidate already allocated in another plan', () => {
    const reserved: ReservedAllocation[] = [
      { destinationId: 'paris', allocatedHabitIds: ['coffee-at-home'] },
    ]
    const conflicts = findActivationConflicts(
      ['coffee-at-home'],
      'tokyo',
      reserved,
      [],
      HABITS,
    )
    expect(conflicts).toEqual([
      {
        habitId: 'coffee-at-home',
        kind: 'same-activity',
        otherDestinationId: 'paris',
        otherHabitId: 'coffee-at-home',
      },
    ])
  })

  it('flags a candidate sharing an exclusive group with another plan', () => {
    // uber-public-transport and walk-short-distances share 'short-trips'.
    const reserved: ReservedAllocation[] = [
      { destinationId: 'paris', allocatedHabitIds: ['walk-short-distances'] },
    ]
    const conflicts = findActivationConflicts(
      ['uber-public-transport'],
      'tokyo',
      reserved,
      [],
      HABITS,
    )
    expect(conflicts).toEqual([
      {
        habitId: 'uber-public-transport',
        kind: 'same-group',
        otherDestinationId: 'paris',
        otherHabitId: 'walk-short-distances',
      },
    ])
  })

  it('flags a one-time habit already credited', () => {
    const conflicts = findActivationConflicts(
      ['repair-shoes'],
      'tokyo',
      [],
      ['repair-shoes'],
      HABITS,
    )
    expect(conflicts).toEqual([
      {
        habitId: 'repair-shoes',
        kind: 'one-time-credited',
        otherDestinationId: '',
        otherHabitId: 'repair-shoes',
      },
    ])
  })

  it('does not treat a plan as a conflict with itself', () => {
    const reserved: ReservedAllocation[] = [
      { destinationId: 'tokyo', allocatedHabitIds: ['coffee-at-home', 'walk-short-distances'] },
    ]
    const conflicts = findActivationConflicts(
      ['coffee-at-home', 'walk-short-distances'],
      'tokyo',
      reserved,
      [],
      HABITS,
    )
    expect(conflicts).toEqual([])
  })

  it('ignores unknown candidate ids', () => {
    const conflicts = findActivationConflicts(['nope'], 'tokyo', [], [], HABITS)
    expect(conflicts).toEqual([])
  })

  it('does not flag recurring habits as one-time-credited', () => {
    const conflicts = findActivationConflicts(
      ['coffee-at-home'],
      'tokyo',
      [],
      ['coffee-at-home'],
      HABITS,
    )
    expect(conflicts).toEqual([])
  })

  it('reports multiple conflicts across candidates', () => {
    const reserved: ReservedAllocation[] = [
      { destinationId: 'paris', allocatedHabitIds: ['coffee-at-home', 'walk-short-distances'] },
    ]
    const conflicts = findActivationConflicts(
      ['coffee-at-home', 'uber-public-transport', 'repair-shoes'],
      'tokyo',
      reserved,
      ['repair-shoes'],
      HABITS,
    )
    expect(conflicts).toHaveLength(3)
    expect(conflicts.map((c) => c.kind).sort()).toEqual([
      'one-time-credited',
      'same-activity',
      'same-group',
    ])
  })
})

describe('data integrity for conflict detection', () => {
  it('every habit resolved by id is present in HABITS', () => {
    for (const id of ['coffee-at-home', 'walk-short-distances', 'repair-shoes']) {
      expect(getHabit(id)).toBeDefined()
    }
  })
})
