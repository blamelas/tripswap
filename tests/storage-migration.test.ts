import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getHabit } from '../src/data/habits'
import {
  achievePlan,
  addAllocation,
  clearPlans,
  confirmAmount,
  getCreditedHabitIds,
  getPlan,
  getReservedAllocations,
  pausePlan,
  readPlans,
  removeAllocation,
  removePlan,
  resumePlan,
  savePlan,
  startPlan,
} from '../src/lib/storage'

const V1_KEY = 'tripswap:unlocks:v1'
const V2_KEY = 'tripswap:plans:v2'
const NOW = '2026-01-01T00:00:00.000Z'

class MemoryStorage {
  private data = new Map<string, string>()

  getItem(key: string): string | null {
    return this.data.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value)
  }

  removeItem(key: string): void {
    this.data.delete(key)
  }

  clear(): void {
    this.data.clear()
  }
}

const storage = new MemoryStorage()

beforeEach(() => {
  storage.clear()
  vi.stubGlobal('window', { localStorage: storage })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('v1 migration', () => {
  it('preserves base fields and leaves the legacy key in place', () => {
    const v1 = JSON.stringify([
      {
        destinationId: 'paris',
        habitIds: ['coffee-at-home'],
        horizonMonths: 12,
        savedAt: NOW,
      },
    ])
    storage.setItem(V1_KEY, v1)

    const plans = readPlans()
    expect(plans).toHaveLength(1)
    expect(plans[0].destinationId).toBe('paris')
    expect(plans[0].habitIds).toEqual(['coffee-at-home'])
    expect(plans[0].horizonMonths).toBe(12)
    expect(plans[0].lifecycle).toBeUndefined()

    expect(storage.getItem(V1_KEY)).toBe(v1)
    expect(storage.getItem(V2_KEY)).toContain('"version":2')
  })

  it('deduplicates by destination id', () => {
    storage.setItem(
      V1_KEY,
      JSON.stringify([
        { destinationId: 'paris', habitIds: ['coffee-at-home'], horizonMonths: 12, savedAt: NOW },
        { destinationId: 'paris', habitIds: ['lunch-from-home'], horizonMonths: 6, savedAt: NOW },
      ]),
    )
    expect(readPlans()).toHaveLength(1)
  })
})

describe('malformed lifecycle', () => {
  it('coerces a malformed lifecycle to undefined without dropping the plan', () => {
    storage.setItem(
      V2_KEY,
      JSON.stringify({
        version: 2,
        plans: [
          {
            destinationId: 'paris',
            habitIds: [],
            horizonMonths: 6,
            savedAt: NOW,
            lifecycle: { status: 'banana' },
          },
        ],
      }),
    )

    const plans = readPlans()
    expect(plans).toHaveLength(1)
    expect(plans[0].lifecycle).toBeUndefined()
  })

  it('drops a plan missing required base fields', () => {
    storage.setItem(
      V2_KEY,
      JSON.stringify({ version: 2, plans: [{ destinationId: 'paris' }] }),
    )
    expect(readPlans()).toEqual([])
  })
})

describe('corrupt storage', () => {
  it('falls back to v1 when the v2 payload is not valid JSON', () => {
    storage.setItem(V2_KEY, '{not json')
    storage.setItem(
      V1_KEY,
      JSON.stringify([
        { destinationId: 'paris', habitIds: ['coffee-at-home'], horizonMonths: 12, savedAt: NOW },
      ]),
    )

    expect(readPlans()).toHaveLength(1)
    expect(readPlans()[0].destinationId).toBe('paris')
  })
})

describe('savePlan', () => {
  it('merges base fields and preserves an existing lifecycle', () => {
    savePlan({
      destinationId: 'paris',
      habitIds: ['coffee-at-home'],
      horizonMonths: 12,
      savedAt: NOW,
    })
    startPlan('paris', [getHabit('coffee-at-home')!], NOW)

    savePlan({
      destinationId: 'paris',
      habitIds: ['lunch-from-home'],
      horizonMonths: 6,
      savedAt: NOW,
    })

    const plan = getPlan('paris')!
    expect(plan.habitIds).toEqual(['lunch-from-home'])
    expect(plan.horizonMonths).toBe(6)
    expect(plan.lifecycle?.status).toBe('active')
    expect(plan.lifecycle?.allocations).toHaveLength(1)
  })

  it('does not reserve any habit', () => {
    savePlan({
      destinationId: 'paris',
      habitIds: ['coffee-at-home', 'repair-shoes'],
      horizonMonths: 12,
      savedAt: NOW,
    })
    expect(getReservedAllocations()).toEqual([])
    expect(getCreditedHabitIds()).toEqual([])
  })
})

describe('startPlan', () => {
  it('reserves recurring habits and credits one-time habits', () => {
    savePlan({
      destinationId: 'paris',
      habitIds: ['coffee-at-home', 'repair-shoes'],
      horizonMonths: 12,
      savedAt: NOW,
    })
    startPlan(
      'paris',
      [getHabit('coffee-at-home')!, getHabit('repair-shoes')!],
      NOW,
    )

    expect(getReservedAllocations()).toEqual([
      { destinationId: 'paris', allocatedHabitIds: ['coffee-at-home'] },
    ])
    expect(getCreditedHabitIds()).toEqual(['repair-shoes'])
  })

  it('stores only the funded habits as the plan selection', () => {
    savePlan({
      destinationId: 'paris',
      habitIds: ['coffee-at-home', 'lunch-from-home'],
      horizonMonths: 12,
      savedAt: NOW,
    })
    startPlan('paris', [getHabit('coffee-at-home')!], NOW)
    expect(getPlan('paris')!.habitIds).toEqual(['coffee-at-home'])
  })

  it('does not double-allocate when started twice', () => {
    savePlan({
      destinationId: 'paris',
      habitIds: ['coffee-at-home'],
      horizonMonths: 12,
      savedAt: NOW,
    })
    startPlan('paris', [getHabit('coffee-at-home')!], NOW)
    startPlan('paris', [getHabit('coffee-at-home')!], NOW)
    expect(getReservedAllocations()[0].allocatedHabitIds).toEqual(['coffee-at-home'])
  })
})

describe('one-time credited once', () => {
  it('deduplicates a credited habit across plans', () => {
    savePlan({ destinationId: 'paris', habitIds: ['repair-shoes'], horizonMonths: 12, savedAt: NOW })
    startPlan('paris', [getHabit('repair-shoes')!], NOW)

    savePlan({ destinationId: 'tokyo', habitIds: ['repair-shoes'], horizonMonths: 12, savedAt: NOW })
    startPlan('tokyo', [getHabit('repair-shoes')!], NOW)

    expect(getCreditedHabitIds()).toEqual(['repair-shoes'])
  })
})

describe('allocations are exclusive to live plans', () => {
  it('releases recurring reservations when a plan is achieved', () => {
    savePlan({ destinationId: 'paris', habitIds: ['coffee-at-home'], horizonMonths: 12, savedAt: NOW })
    startPlan('paris', [getHabit('coffee-at-home')!], NOW)
    achievePlan('paris', '2026-02-01T00:00:00.000Z')

    expect(getReservedAllocations()).toEqual([])
  })

  it('adds a funded swap to the saved selection', () => {
    savePlan({ destinationId: 'barcelona', habitIds: [], horizonMonths: 12, savedAt: NOW })
    startPlan('barcelona', [], NOW)
    addAllocation('barcelona', getHabit('coffee-at-home')!, NOW)

    expect(getPlan('barcelona')!.habitIds).toEqual(['coffee-at-home'])
    expect(getPlan('barcelona')!.lifecycle!.allocations).toHaveLength(1)
  })

  it('refuses to add a swap already funded by another active plan', () => {
    savePlan({ destinationId: 'paris', habitIds: ['coffee-at-home'], horizonMonths: 12, savedAt: NOW })
    startPlan('paris', [getHabit('coffee-at-home')!], NOW)

    savePlan({ destinationId: 'barcelona', habitIds: [], horizonMonths: 12, savedAt: NOW })
    startPlan('barcelona', [], NOW)

    addAllocation('barcelona', getHabit('coffee-at-home')!, '2026-02-01T00:00:00.000Z')
    expect(getPlan('barcelona')!.lifecycle!.allocations).toEqual([])
  })
})

describe('lifecycle mutators', () => {
  it('pauses, resumes and confirms without touching other plans', () => {
    savePlan({ destinationId: 'paris', habitIds: ['coffee-at-home'], horizonMonths: 12, savedAt: NOW })
    savePlan({ destinationId: 'tokyo', habitIds: ['lunch-from-home'], horizonMonths: 12, savedAt: NOW })
    startPlan('paris', [getHabit('coffee-at-home')!], NOW)
    startPlan('tokyo', [getHabit('lunch-from-home')!], NOW)

    pausePlan('paris', '2026-02-01T00:00:00.000Z')
    expect(getPlan('paris')!.lifecycle!.status).toBe('paused')
    expect(getPlan('tokyo')!.lifecycle!.status).toBe('active')

    resumePlan('paris', '2026-03-01T00:00:00.000Z')
    confirmAmount('tokyo', 25)
    expect(getPlan('paris')!.lifecycle!.status).toBe('active')
    expect(getPlan('tokyo')!.lifecycle!.confirmed).toBe(25)
  })

  it('releases an allocation and preserves it as closed history', () => {
    savePlan({ destinationId: 'paris', habitIds: ['coffee-at-home'], horizonMonths: 12, savedAt: NOW })
    startPlan('paris', [getHabit('coffee-at-home')!], NOW)

    removeAllocation('paris', 'coffee-at-home', '2026-02-01T00:00:00.000Z')

    const plan = getPlan('paris')!
    expect(plan.lifecycle!.allocations).toEqual([])
    expect(plan.lifecycle!.periods).toHaveLength(1)
    expect(plan.lifecycle!.periods[0].end).toBe('2026-02-01T00:00:00.000Z')
    expect(getReservedAllocations()).toEqual([])
  })
})

describe('removePlan and clearPlans', () => {
  it('removes one plan without breaking the others', () => {
    savePlan({ destinationId: 'paris', habitIds: ['coffee-at-home'], horizonMonths: 12, savedAt: NOW })
    savePlan({ destinationId: 'tokyo', habitIds: ['lunch-from-home'], horizonMonths: 12, savedAt: NOW })

    removePlan('paris')
    expect(readPlans().map((p) => p.destinationId)).toEqual(['tokyo'])
  })

  it('clears both the v2 and legacy keys', () => {
    storage.setItem(V1_KEY, JSON.stringify([]))
    savePlan({ destinationId: 'paris', habitIds: ['coffee-at-home'], horizonMonths: 12, savedAt: NOW })

    clearPlans()
    expect(readPlans()).toEqual([])
    expect(storage.getItem(V2_KEY)).toBeNull()
    expect(storage.getItem(V1_KEY)).toBeNull()
  })
})
