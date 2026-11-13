import type { Habit, HabitCategory } from '../types'
import {
  HABITS,
  HABIT_CATEGORY_LABELS,
  HABIT_CATEGORY_ORDER,
} from '../data/habits'
import { conflictWith } from '../lib/conflicts'
import { HabitCard } from './HabitCard'

interface HabitSelectorProps {
  selectedIds: string[]
  onToggle: (habit: Habit) => void
}

export function HabitSelector({ selectedIds, onToggle }: HabitSelectorProps) {
  const grouped = HABIT_CATEGORY_ORDER.map((category) => ({
    category,
    habits: HABITS.filter((habit) => habit.category === category),
  }))

  return (
    <div className="space-y-10">
      {grouped.map(({ category, habits }) => (
        <section key={category} aria-labelledby={`cat-${category}`}>
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2.5">
            <h3
              id={`cat-${category}`}
              className="font-display text-[1.35rem] text-ink"
            >
              {HABIT_CATEGORY_LABELS[category as HabitCategory]}
            </h3>
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted">
              {habits.length} trocas
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
      ))}
    </div>
  )
}
