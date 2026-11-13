import type { Destination } from '../types'
import { HABITS } from '../data/habits'
import { sanitizeSelection } from './conflicts'

export interface Preset {
  id: string
  label: string
  description: string
  habitIds: string[]
}

export function getPresets(destination: Destination): Preset[] {
  const recommended = destination.recommendedHabitIds
  const consciousExtras = ['water-instead-of-soft-drinks', 'repair-shoes']

  return [
    {
      id: 'essential',
      label: 'Essencial',
      description: 'Duas trocas, sem mexer no resto.',
      habitIds: sanitizeSelection(recommended.slice(0, 2), HABITS),
    },
    {
      id: 'balanced',
      label: 'Equilibrado',
      description: 'O plano sugerido para este destino.',
      habitIds: sanitizeSelection(recommended, HABITS),
    },
    {
      id: 'conscious',
      label: 'Consciente',
      description: 'Mais trocas, incluindo reparar e beber melhor.',
      habitIds: sanitizeSelection([...recommended, ...consciousExtras], HABITS),
    },
  ]
}
