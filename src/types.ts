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

export type LifecycleStatus = 'saved' | 'active' | 'paused' | 'achieved'

export interface Allocation {
  habitId: string
  /** Snapshot of the habit's monthlySaving at allocation time. */
  monthly: number
  allocatedAt: string
}

export interface AllocationPeriod {
  habitId: string
  /** Snapshot of the habit's monthlySaving at period open. */
  monthly: number
  /** ISO, inclusive. */
  start: string
  /** ISO, exclusive; null = still accumulating. */
  end: string | null
}

export interface OneTimeCredit {
  habitId: string
  amount: number
  creditedAt: string
  destinationId: string
}

export interface PlanLifecycle {
  status: LifecycleStatus
  activatedAt: string | null
  achievedAt: string | null
  allocations: Allocation[]
  periods: AllocationPeriod[]
  oneTimeCredits: OneTimeCredit[]
  /** User-confirmed savings, separate from estimated accumulation. */
  confirmed: number
}

export interface SavedPlan {
  destinationId: string
  habitIds: string[]
  horizonMonths: number
  savedAt: string
  gamesEstimate?: GamesEstimate
  lifecycle?: PlanLifecycle
}

export type ReminderFrequency = 'daily' | 'monthly'

export interface PlanReminder {
  destinationId: string
  frequency: ReminderFrequency
  time: string
  dayOfMonth?: number
  createdAt: string
}
