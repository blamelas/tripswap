import type { PlanResult } from './calc'

export const HORIZONS = [3, 6, 12, 24] as const

export type PlanState = 'discover' | 'on-the-way' | 'unlocked' | 'unreachable'

export function planState(plan: PlanResult): PlanState {
  if (plan.habits.length === 0) return 'discover'
  if (plan.monthsToTarget === null) return 'unreachable'
  return plan.unlocked ? 'unlocked' : 'on-the-way'
}
