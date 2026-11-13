import { HeartPulse, Route, Ticket, Utensils, Wrench } from 'lucide-react'
import type { Habit, HabitCategory } from '../types'
import { HABITS, HABIT_CATEGORY_ORDER } from '../data/habits'
import { useI18n } from '../i18n/context'
import { conflictWith } from '../lib/conflicts'
import { HabitCard } from './HabitCard'

const CATEGORY_ICONS: Record<HabitCategory, typeof Route> = {
  mobility: Route,
  food: Utensils,
  entertainment: Ticket,
  shopping: Wrench,
  wellbeing: HeartPulse,
}

interface HabitSelectorProps {
  selectedIds: string[]
  onToggle: (habit: Habit) => void
}

export function HabitSelector({ selectedIds, onToggle }: HabitSelectorProps) {
  const { copy } = useI18n()

  return (
    <div>
      {HABIT_CATEGORY_ORDER.map((category, index) => {
        const habits = HABITS.filter((habit) => habit.category === category)
        const Icon = CATEGORY_ICONS[category]
        return (
          <section
            key={category}
            aria-labelledby={`cat-${category}`}
            className="mt-8 first:mt-0"
          >
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink pb-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-ink/15 text-ink">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <h3
                  id={`cat-${category}`}
                  className="text-[1.55rem] leading-none text-ink"
                >
                  {copy.habitCategories[category]}
                </h3>
                <span className="nums text-[10px] text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <span className="nums text-[10px] text-muted">
                {copy.habitSelector.count(habits.length)}
              </span>
            </div>

            <div>
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
