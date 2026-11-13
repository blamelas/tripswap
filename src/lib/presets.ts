import type { Destination } from '../types'
import { HABITS } from '../data/habits'
import { sanitizeSelection } from './conflicts'

export interface Preset {
  id: 'essential' | 'balanced' | 'conscious'
  habitIds: string[]
}

export function getPresets(destination: Destination): Preset[] {
  const recommended = destination.recommendedHabitIds
  const consciousExtras = ['water-instead-of-soft-drinks', 'repair-shoes']

  return [
    {
      id: 'essential',
      habitIds: sanitizeSelection(recommended.slice(0, 2), HABITS),
    },
    {
      id: 'balanced',
      habitIds: sanitizeSelection(recommended, HABITS),
    },
    {
      id: 'conscious',
      habitIds: sanitizeSelection([...recommended, ...consciousExtras], HABITS),
    },
  ]
}
