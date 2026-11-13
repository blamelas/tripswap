export type DestinationCategory =
  | 'weekend'
  | 'city'
  | 'nature'
  | 'winter'
  | 'culture'
  | 'journey'

export type HabitCategory =
  | 'mobility'
  | 'food'
  | 'entertainment'
  | 'shopping'
  | 'wellbeing'

export type HabitKind = 'recurring' | 'one-time'

export interface Habit {
  id: string
  title: string
  description: string
  category: HabitCategory
  kind: HabitKind
  originalCost: number
  alternativeCost: number
  monthlyFrequency?: number
  saving: number
  assumptions: string
  exclusiveGroup?: string
  benefits: string[]
}

export interface Destination {
  id: string
  name: string
  country: string
  category: DestinationCategory
  duration: string
  image: string
  imageAlt: string
  imageCredit: string
  quote: string
  description: string
  budget: number
  departureCity: string
  travelers: number
  nights: number
  includes: string[]
  recommendedHabitIds: string[]
}

export interface SavedPlan {
  destinationId: string
  habitIds: string[]
  horizonMonths: number
  savedAt: string
}
