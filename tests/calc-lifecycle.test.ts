import { describe, expect, it } from 'vitest'
import {
  DAYS_PER_MONTH,
  accumulatedOneTime,
  accumulatedRecurring,
  combinedTotals,
  elapsedDays,
  planProgress,
  round2,
} from '../src/lib/calc'
import type { AllocationPeriod, OneTimeCredit } from '../src/types'

const START = '2026-01-01T00:00:00.000Z'

/** Build an ISO timestamp `days` after START, as whole 24h steps. */
function day(days: number): string {
  return new Date(Date.parse(START) + days * 86_400_000).toISOString()
}

/** A monthly value equal to DAYS_PER_MONTH makes accrual exactly `1` per day. */
const MONTH = DAYS_PER_MONTH

describe('elapsedDays', () => {
  it('measures whole-day spans and clamps negatives to zero', () => {
    expect(elapsedDays(START, day(10))).toBe(10)
    expect(elapsedDays(day(10), START)).toBe(0)
  })

  it('returns zero for invalid dates', () => {
    expect(elapsedDays('nope', day(5))).toBe(0)
    expect(elapsedDays(START, 'nope')).toBe(0)
  })
})

describe('accumulatedRecurring', () => {
  it('accrues an open period up to now', () => {
    const periods: AllocationPeriod[] = [
      { habitId: 'h1', monthly: MONTH, start: START, end: null },
    ]
    expect(accumulatedRecurring(periods, day(10))).toBe(10)
  })

  it('stops accumulating a closed period at its end', () => {
    const periods: AllocationPeriod[] = [
      { habitId: 'h1', monthly: MONTH, start: START, end: day(5) },
    ]
    // Ten days later, only the first five days count.
    expect(accumulatedRecurring(periods, day(10))).toBe(5)
  })

  it('does not count the gap between a closed period and a resumed one', () => {
    const periods: AllocationPeriod[] = [
      { habitId: 'h1', monthly: MONTH, start: START, end: day(5) },
      { habitId: 'h1', monthly: MONTH, start: day(15), end: null },
    ]
    // 5 days closed + 10 days into the second open period; the gap is skipped.
    expect(accumulatedRecurring(periods, day(25))).toBe(15)
  })

  it('still counts a closed period after it is released', () => {
    const periods: AllocationPeriod[] = [
      { habitId: 'h1', monthly: MONTH, start: START, end: day(9) },
    ]
    expect(accumulatedRecurring(periods, day(20))).toBe(9)
  })

  it('rounds fractional accrual to cents', () => {
    const periods: AllocationPeriod[] = [
      { habitId: 'h1', monthly: 32.4, start: START, end: day(5) },
    ]
    expect(accumulatedRecurring(periods, day(10))).toBe(
      round2((32.4 * 5) / DAYS_PER_MONTH),
    )
  })
})

describe('accumulatedOneTime', () => {
  it('sums credited amounts once each', () => {
    const credits: OneTimeCredit[] = [
      { habitId: 'a', amount: 65, creditedAt: START, destinationId: 'paris' },
      { habitId: 'b', amount: 120, creditedAt: START, destinationId: 'paris' },
    ]
    expect(accumulatedOneTime(credits)).toBe(185)
  })
})

describe('planProgress', () => {
  const allocations = [{ habitId: 'h1', monthly: 30, allocatedAt: START }]

  it('keeps confirmed separate from accumulated', () => {
    const progress = planProgress(
      100,
      allocations,
      [],
      [],
      40,
      day(0),
    )
    expect(progress.accumulated).toBe(0)
    expect(progress.confirmed).toBe(40)
    expect(progress.remaining).toBe(100)
    expect(progress.progress).toBe(0)
  })

  it('combines recurring and one-time into accumulated and clamps progress', () => {
    const periods: AllocationPeriod[] = [
      { habitId: 'h1', monthly: MONTH, start: START, end: day(10) },
    ]
    const credits: OneTimeCredit[] = [
      { habitId: 'x', amount: 20, creditedAt: START, destinationId: 'paris' },
    ]
    // 10 recurring + 20 one-time = 30 of a 25 target -> progress clamped to 1.
    const progress = planProgress(25, [], periods, credits, 0, day(10))
    expect(progress.accumulated).toBe(30)
    expect(progress.remaining).toBe(0)
    expect(progress.progress).toBe(1)
    expect(progress.monthsRemaining).toBe(0)
  })

  it('sums allocation monthly for monthsRemaining', () => {
    const progress = planProgress(
      650,
      [
        { habitId: 'h1', monthly: 32, allocatedAt: START },
        { habitId: 'h2', monthly: 60, allocatedAt: START },
      ],
      [],
      [],
      0,
      day(0),
    )
    expect(progress.monthly).toBe(92)
    expect(progress.monthsRemaining).toBe(8)
  })

  it('returns null monthsRemaining when nothing accrues', () => {
    const progress = planProgress(650, [], [], [], 0, day(0))
    expect(progress.monthly).toBe(0)
    expect(progress.monthsRemaining).toBeNull()
  })
})

describe('combinedTotals', () => {
  it('sums accumulated and target without summing percentages', () => {
    const totals = combinedTotals([
      { target: 100, accumulated: 30 },
      { target: 200, accumulated: 60 },
    ])
    expect(totals.activeCount).toBe(2)
    expect(totals.accumulated).toBe(90)
    expect(totals.target).toBe(300)
    expect(totals.progress).toBeCloseTo(0.3, 5)
  })

  it('clamps progress to 1 when accumulated exceeds target', () => {
    const totals = combinedTotals([{ target: 50, accumulated: 80 }])
    expect(totals.progress).toBe(1)
  })

  it('handles an empty set with zero progress', () => {
    const totals = combinedTotals([])
    expect(totals.activeCount).toBe(0)
    expect(totals.progress).toBe(0)
  })
})
