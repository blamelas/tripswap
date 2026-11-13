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
  bar: string
}

export const HABIT_CATEGORY_META: Record<HabitCategory, HabitCategoryMeta> = {
  mobility: {
    icon: Route,
    color: 'text-cat-mobility',
    soft: 'bg-cat-mobility-soft',
    border: 'border-cat-mobility',
    bar: 'bg-cat-mobility',
  },
  food: {
    icon: Utensils,
    color: 'text-cat-food',
    soft: 'bg-cat-food-soft',
    border: 'border-cat-food',
    bar: 'bg-cat-food',
  },
  entertainment: {
    icon: Ticket,
    color: 'text-cat-entertainment',
    soft: 'bg-cat-entertainment-soft',
    border: 'border-cat-entertainment',
    bar: 'bg-cat-entertainment',
  },
  shopping: {
    icon: Wrench,
    color: 'text-cat-shopping',
    soft: 'bg-cat-shopping-soft',
    border: 'border-cat-shopping',
    bar: 'bg-cat-shopping',
  },
  wellbeing: {
    icon: HeartPulse,
    color: 'text-cat-wellbeing',
    soft: 'bg-cat-wellbeing-soft',
    border: 'border-cat-wellbeing',
    bar: 'bg-cat-wellbeing',
  },
  games: {
    icon: Dices,
    color: 'text-cat-games',
    soft: 'bg-cat-games-soft',
    border: 'border-cat-games',
    bar: 'bg-cat-games',
  },
}
