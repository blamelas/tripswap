import { useState } from 'react'
import {
  ChevronDown,
  HeartPulse,
  Route,
  Ticket,
  Utensils,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { Habit, HabitCategory } from '../types'
import { HABITS, HABIT_CATEGORY_ORDER } from '../data/habits'
import { useI18n } from '../i18n/context'
import { conflictWith } from '../lib/conflicts'
import { cn } from '../lib/cn'
import { HabitCard } from './HabitCard'

interface CategoryMeta {
  icon: LucideIcon
  color: string
  soft: string
  border: string
}

const CATEGORY: Record<HabitCategory, CategoryMeta> = {
  mobility: {
    icon: Route,
    color: 'text-cat-mobility',
    soft: 'bg-cat-mobility-soft',
    border: 'border-cat-mobility',
  },
  food: {
    icon: Utensils,
    color: 'text-cat-food',
    soft: 'bg-cat-food-soft',
    border: 'border-cat-food',
  },
  entertainment: {
    icon: Ticket,
    color: 'text-cat-entertainment',
    soft: 'bg-cat-entertainment-soft',
    border: 'border-cat-entertainment',
  },
  shopping: {
    icon: Wrench,
    color: 'text-cat-shopping',
    soft: 'bg-cat-shopping-soft',
    border: 'border-cat-shopping',
  },
  wellbeing: {
    icon: HeartPulse,
    color: 'text-cat-wellbeing',
    soft: 'bg-cat-wellbeing-soft',
    border: 'border-cat-wellbeing',
  },
}

interface HabitSelectorProps {
  selectedIds: string[]
  onToggle: (habit: Habit) => void
}

export function HabitSelector({ selectedIds, onToggle }: HabitSelectorProps) {
  const { copy } = useI18n()
  const [closed, setClosed] = useState<Record<string, boolean>>({})

  return (
    <div>
      {HABIT_CATEGORY_ORDER.map((category, index) => {
        const habits = HABITS.filter((habit) => habit.category === category)
        const selectedCount = habits.filter((habit) =>
          selectedIds.includes(habit.id),
        ).length
        const meta = CATEGORY[category]
        const Icon = meta.icon
        const isOpen = !closed[category]
        const panelId = `cat-${category}-panel`

        return (
          <section key={category} className={index === 0 ? '' : 'mt-9'}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() =>
                  setClosed((previous) => ({
                    ...previous,
                    [category]: !previous[category],
                  }))
                }
                className={cn(
                  'flex w-full items-center gap-3 border-b-2 pb-3 text-left transition-colors',
                  meta.border,
                )}
              >
                <span
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center',
                    meta.soft,
                    meta.color,
                  )}
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" strokeWidth={2.15} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[21px] font-semibold uppercase leading-none text-ink">
                    {copy.habitCategories[category]}
                  </span>
                  <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                    {copy.habitSelector.summary(habits.length, selectedCount)}
                  </span>
                </span>

                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-muted transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>

            <div id={panelId} hidden={!isOpen}>
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  selected={selectedIds.includes(habit.id)}
                  replacedHabit={conflictWith(selectedIds, habit, HABITS)}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
