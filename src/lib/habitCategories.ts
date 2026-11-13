import {
  Dices,
  HeartPulse,
  Route,
  Ticket,
  Utensils,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { HabitCategory } from '../types'

export interface HabitCategoryMeta {
  icon: LucideIcon
  color: string
  soft: string
  border: string
  wash: string
}

export const HABIT_CATEGORY_META: Record<HabitCategory, HabitCategoryMeta> = {
  mobility: {
    icon: Route,
    color: 'text-cat-mobility',
    soft: 'bg-cat-mobility-soft',
    border: 'border-cat-mobility',
    wash: 'bg-cat-mobility-soft/60',
  },
  food: {
    icon: Utensils,
    color: 'text-cat-food',
    soft: 'bg-cat-food-soft',
    border: 'border-cat-food',
    wash: 'bg-cat-food-soft/60',
  },
  entertainment: {
    icon: Ticket,
    color: 'text-cat-entertainment',
    soft: 'bg-cat-entertainment-soft',
    border: 'border-cat-entertainment',
    wash: 'bg-cat-entertainment-soft/60',
  },
  shopping: {
    icon: Wrench,
    color: 'text-cat-shopping',
    soft: 'bg-cat-shopping-soft',
    border: 'border-cat-shopping',
    wash: 'bg-cat-shopping-soft/60',
  },
  wellbeing: {
    icon: HeartPulse,
    color: 'text-cat-wellbeing',
    soft: 'bg-cat-wellbeing-soft',
    border: 'border-cat-wellbeing',
    wash: 'bg-cat-wellbeing-soft/60',
  },
  games: {
    icon: Dices,
    color: 'text-cat-games',
    soft: 'bg-cat-games-soft',
    border: 'border-cat-games',
    wash: 'bg-cat-games-soft/60',
  },
}
