import type { GamesEstimate, Habit } from '../types'
import { round2 } from './calc'

export function applyGamesEstimate(
  habit: Habit,
  estimate: GamesEstimate | null | undefined,
): Habit {
  if (!habit.customExpense || !estimate) return habit

  const current = Math.max(0, estimate.current)
  const reduced = Math.min(current, Math.max(0, estimate.reduced))

  return {
    ...habit,
    originalCost: current,
    alternativeCost: reduced,
    monthlyFrequency: 1,
    saving: round2(current - reduced),
  }
}

export function hasGamesSaving(
  estimate: GamesEstimate | null | undefined,
): boolean {
  return (
    !!estimate &&
    Number.isFinite(estimate.current) &&
    Number.isFinite(estimate.reduced) &&
    estimate.current > estimate.reduced
  )
}
