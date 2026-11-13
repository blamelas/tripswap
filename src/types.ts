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
  | 'games'

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
  /** Saving depends on user-entered current/reduced monthly spend. */
  customExpense?: boolean
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

export interface GamesEstimate {
  current: number
  reduced: number
}

export interface SavedPlan {
  destinationId: string
  habitIds: string[]
  horizonMonths: number
  savedAt: string
  gamesEstimate?: GamesEstimate
}

export type ReminderFrequency = 'daily' | 'monthly'

export interface PlanReminder {
  destinationId: string
  frequency: ReminderFrequency
  time: string
  dayOfMonth?: number
  createdAt: string
}
