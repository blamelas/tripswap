import { describe, expect, it } from 'vitest'
import { calculatePlan } from '../src/lib/calc'
import { getHabit } from '../src/data/habits'
import {
  achieve,
  activate,
  addConfirmed,
  allocate,
  pause,
  releaseAllocation,
  resume,
} from '../src/lib/lifecycle'
import { planState } from '../src/lib/planState'
import type { SavedPlan } from '../src/types'

const NOW = '2026-01-01T00:00:00.000Z'
const T1 = '2026-02-01T00:00:00.000Z'
const T2 = '2026-03-01T00:00:00.000Z'
const T3 = '2026-04-01T00:00:00.000Z'

function plan(habitIds: string[]): SavedPlan {
  return {
    destinationId: 'paris',
    habitIds,
    horizonMonths: 12,
    savedAt: NOW,
  }
}

describe('activate', () => {
  it('snapshots savings and opens a period per recurring habit', () => {
    const lifecycle = activate(plan(['coffee-at-home']), [getHabit('coffee-at-home')!], NOW)
    expect(lifecycle.status).toBe('active')
    expect(lifecycle.activatedAt).toBe(NOW)
    expect(lifecycle.achievedAt).toBeNull()
    expect(lifecycle.allocations).toEqual([
      { habitId: 'coffee-at-home', monthly: 32, allocatedAt: NOW },
    ])
    expect(lifecycle.periods).toEqual([
      { habitId: 'coffee-at-home', monthly: 32, start: NOW, end: null },
    ])
    expect(lifecycle.oneTimeCredits).toEqual([])
  })

  it('credits each one-time habit once', () => {
    const lifecycle = activate(plan(['repair-shoes']), [getHabit('repair-shoes')!], NOW)
    expect(lifecycle.allocations).toEqual([])
    expect(lifecycle.periods).toEqual([])
    expect(lifecycle.oneTimeCredits).toEqual([
      { habitId: 'repair-shoes', amount: 65, creditedAt: NOW, destinationId: 'paris' },
    ])
  })

  it('skips zero-saving habits', () => {
    const lifecycle = activate(
      plan(['games-betting']),
      [getHabit('games-betting')!],
      NOW,
    )
    expect(lifecycle.allocations).toEqual([])
    expect(lifecycle.periods).toEqual([])
    expect(lifecycle.oneTimeCredits).toEqual([])
  })
})

describe('pause and resume', () => {
  it('closes open periods on pause', () => {
    const lifecycle = pause(activate(plan(['coffee-at-home']), [getHabit('coffee-at-home')!], NOW), T1)
    expect(lifecycle.status).toBe('paused')
    expect(lifecycle.periods[0].end).toBe(T1)
  })

  it('opens a new period on resume without backfilling the gap', () => {
    const started = activate(plan(['coffee-at-home']), [getHabit('coffee-at-home')!], NOW)
    const paused = pause(started, T1)
    const resumed = resume(paused, T2)
    expect(resumed.status).toBe('active')
    expect(resumed.periods).toHaveLength(2)
    expect(resumed.periods[0].end).toBe(T1)
    expect(resumed.periods[1]).toEqual({
      habitId: 'coffee-at-home',
      monthly: 32,
      start: T2,
      end: null,
    })
  })
})

describe('releaseAllocation', () => {
  it('removes the allocation but keeps the closed period as history', () => {
    const started = activate(plan(['coffee-at-home']), [getHabit('coffee-at-home')!], NOW)
    const released = releaseAllocation(started, 'coffee-at-home', T2)
    expect(released.allocations).toEqual([])
    expect(released.periods).toEqual([
      { habitId: 'coffee-at-home', monthly: 32, start: NOW, end: T2 },
    ])
  })

  it('also releases a matching one-time credit', () => {
    const started = activate(plan(['repair-shoes']), [getHabit('repair-shoes')!], NOW)
    const released = releaseAllocation(started, 'repair-shoes', T2)
    expect(released.oneTimeCredits).toEqual([])
  })
})

describe('allocate', () => {
  it('opens a period for a newly added recurring habit', () => {
    const started = activate(plan(['coffee-at-home']), [getHabit('coffee-at-home')!], NOW)
    const next = allocate(started, getHabit('lunch-from-home')!, 'paris', T1)
    expect(next.allocations).toHaveLength(2)
    expect(next.periods[1]).toEqual({
      habitId: 'lunch-from-home',
      monthly: 60,
      start: T1,
      end: null,
    })
  })

  it('credits a newly added one-time habit', () => {
    const started = activate(plan(['coffee-at-home']), [getHabit('coffee-at-home')!], NOW)
    const next = allocate(started, getHabit('repair-equipment')!, 'paris', T1)
    expect(next.oneTimeCredits).toEqual([
      { habitId: 'repair-equipment', amount: 120, creditedAt: T1, destinationId: 'paris' },
    ])
  })
})

describe('achieve', () => {
  it('is explicit only and closes open periods', () => {
    const started = activate(plan(['coffee-at-home']), [getHabit('coffee-at-home')!], NOW)
    // Activation alone never achieves.
    expect(started.status).toBe('active')
    expect(started.achievedAt).toBeNull()

    const achieved = achieve(started, T3)
    expect(achieved.status).toBe('achieved')
    expect(achieved.achievedAt).toBe(T3)
    expect(achieved.periods[0].end).toBe(T3)
  })
})

describe('addConfirmed', () => {
  it('accumulates confirmed separately', () => {
    const started = activate(plan(['coffee-at-home']), [getHabit('coffee-at-home')!], NOW)
    expect(addConfirmed(started, 10).confirmed).toBe(10)
    expect(addConfirmed(addConfirmed(started, 10), 0.4).confirmed).toBe(10.4)
  })
})

describe('simulation state', () => {
  it('never maps an unlocked plan to achieved', () => {
    const result = calculatePlan(32, [getHabit('coffee-at-home')!], 12)
    expect(result.unlocked).toBe(true)
    expect(planState(result)).toBe('unlocked')
    expect(planState(result)).not.toBe('achieved')
  })
})
