import { describe, expect, it } from 'vitest'
import {
  calculatePlan,
  monthlySaving,
  monthsToTarget,
  oneTimeSaving,
  projectedSavings,
  round2,
} from '../src/lib/calc'
import { HABITS, getHabit } from '../src/data/habits'
import { DESTINATIONS } from '../src/data/destinations'
import { sanitizeSelection, toggleHabit } from '../src/lib/conflicts'

function habits(ids: string[]) {
  return ids.map((id) => {
    const habit = getHabit(id)
    if (!habit) throw new Error(`Unknown habit: ${id}`)
    return habit
  })
}

describe('habit catalogue', () => {
  it('has 25 habits with unique ids', () => {
    expect(HABITS).toHaveLength(25)
    expect(new Set(HABITS.map((habit) => habit.id)).size).toBe(HABITS.length)
  })

  it('keeps the stored saving equal to the documented formula', () => {
    for (const habit of HABITS) {
      const derived =
        habit.kind === 'recurring' ? monthlySaving(habit) : oneTimeSaving(habit)
      expect(derived, habit.id).toBe(habit.saving)
      expect(habit.saving).toBeGreaterThan(0)
    }
  })

  it('only uses a monthly frequency for recurring habits', () => {
    for (const habit of HABITS) {
      if (habit.kind === 'recurring') {
        expect(habit.monthlyFrequency, habit.id).toBeGreaterThan(0)
      } else {
        expect(habit.monthlyFrequency, habit.id).toBeUndefined()
      }
    }
  })

  it('never mixes a one-time saving into the monthly total', () => {
    const plan = calculatePlan(650, habits(['repair-shoes']), 12)
    expect(plan.monthly).toBe(0)
    expect(plan.oneTime).toBe(65)
    expect(plan.projectedAtHorizon).toBe(65)
  })
})

describe('documented savings assumptions', () => {
  it('matches the published values', () => {
    const expected: Record<string, number> = {
      'coffee-at-home': 32,
      'lunch-from-home': 60,
      'reduce-takeaway': 40,
      'walk-short-distances': 42,
      'uber-public-transport': 30,
      'replace-bought-snacks': 32.4,
      'reduce-alcohol': 40,
      'water-instead-of-soft-drinks': 24,
      'half-nights-out': 50,
      'cancel-streaming': 12,
      'stop-tobacco': 120,
      'repair-shoes': 65,
      'repair-equipment': 120,
      'exercise-at-home': 30,
      'games-betting': 20,
    }

    for (const [id, value] of Object.entries(expected)) {
      expect(getHabit(id)?.saving, id).toBe(value)
    }
  })
})

describe('months to target', () => {
  it('returns the earliest whole month', () => {
    expect(monthsToTarget(650, 122, 0)).toBe(6)
    expect(monthsToTarget(90, 30, 0)).toBe(3)
    expect(monthsToTarget(100, 30, 0)).toBe(4)
  })

  it('counts one-time savings once, at the start', () => {
    expect(projectedSavings(32, 65, 12)).toBe(449)
    expect(monthsToTarget(650, 32, 65)).toBe(19)
  })

  it('returns null when only one-time savings cannot reach the target', () => {
    expect(monthsToTarget(1200, 0, 145)).toBeNull()
  })

  it('returns month 1 when one-time savings already cover the target', () => {
    expect(monthsToTarget(100, 0, 145)).toBe(1)
  })

  it('returns null past the maximum projection window', () => {
    expect(monthsToTarget(3000, 10, 0)).toBeNull()
  })
})

describe('plan projection', () => {
  it('sums recurring and one-time savings without double counting', () => {
    const plan = calculatePlan(650, habits(['coffee-at-home', 'lunch-from-home']), 12)
    expect(plan.monthly).toBe(92)
    expect(plan.oneTime).toBe(0)
    expect(plan.projectedAtHorizon).toBe(1104)
    expect(plan.monthsToTarget).toBe(8)
    expect(plan.unlocked).toBe(true)
  })

  it('handles zero selections', () => {
    const plan = calculatePlan(650, [], 12)
    expect(plan.lines).toHaveLength(0)
    expect(plan.monthly).toBe(0)
    expect(plan.oneTime).toBe(0)
    expect(plan.monthsToTarget).toBeNull()
    expect(plan.unlocked).toBe(false)
    expect(plan.progress).toBe(0)
  })

  it('keeps the plan locked when the goal is beyond the horizon', () => {
    const plan = calculatePlan(650, habits(['coffee-at-home']), 3)
    expect(plan.monthsToTarget).toBe(21)
    expect(plan.unlocked).toBe(false)
    expect(plan.remainingAtHorizon).toBe(554)
    expect(plan.progress).toBeCloseTo(96 / 650, 5)
  })

  it('unlocks exactly at the horizon boundary', () => {
    const plan = calculatePlan(96, habits(['coffee-at-home']), 3)
    expect(plan.monthsToTarget).toBe(3)
    expect(plan.unlocked).toBe(true)
    expect(plan.remainingAtHorizon).toBe(0)
  })

  it('rounds monetary arithmetic to cents', () => {
    expect(round2(32.4 + 14.4)).toBe(46.8)
    const plan = calculatePlan(500, habits(['replace-bought-snacks', 'simpler-snacks']), 12)
    expect(plan.lines).toHaveLength(1)
  })
})

describe('overlap handling', () => {
  it('replaces a habit from the same exclusive group', () => {
    const uber = getHabit('uber-public-transport')!
    const walk = getHabit('walk-short-distances')!
    const afterFirst = toggleHabit([], uber, HABITS)
    const afterSecond = toggleHabit(afterFirst, walk, HABITS)
    expect(afterSecond).toEqual(['walk-short-distances'])
  })

  it('removes a habit when toggled twice', () => {
    const coffee = getHabit('coffee-at-home')!
    expect(toggleHabit(toggleHabit([], coffee, HABITS), coffee, HABITS)).toEqual([])
  })

  it('sanitises deep links with duplicates and unknown ids', () => {
    const cleaned = sanitizeSelection(
      ['uber-public-transport', 'walk-short-distances', 'coffee-at-home', 'nope'],
      HABITS,
    )
    expect(cleaned).toEqual(['uber-public-transport', 'coffee-at-home'])
  })

  it('keeps every destination recommendation conflict-free', () => {
    for (const destination of DESTINATIONS) {
      const cleaned = sanitizeSelection(destination.recommendedHabitIds, HABITS)
      expect(cleaned, destination.id).toEqual(destination.recommendedHabitIds)
    }
  })
})

describe('destinations', () => {
  it('has eight destinations with a positive illustrative budget', () => {
    expect(DESTINATIONS).toHaveLength(8)
    for (const destination of DESTINATIONS) {
      expect(destination.budget).toBeGreaterThan(0)
      expect(destination.travelers).toBeGreaterThan(0)
      expect(destination.nights).toBeGreaterThan(0)
      expect(destination.includes.length).toBeGreaterThan(0)
    }
  })

  it('every recommended habit exists', () => {
    for (const destination of DESTINATIONS) {
      for (const id of destination.recommendedHabitIds) {
        expect(getHabit(id), `${destination.id} -> ${id}`).toBeDefined()
      }
    }
  })
})
