import type { Habit } from '../types'
import { HABITS, HABIT_CATEGORY_ORDER } from '../data/habits'
import { useI18n } from '../i18n/context'
import { conflictWith } from '../lib/conflicts'
import { HabitCard } from './HabitCard'

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
        return (
          <section
            key={category}
            aria-labelledby={`cat-${category}`}
            className="mt-8 first:mt-0"
          >
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink pb-2">
              <div className="flex items-baseline gap-3">
                <span className="nums text-[10px] text-accent-dark">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3
                  id={`cat-${category}`}
                  className="text-[1.55rem] leading-none text-ink"
                >
                  {copy.habitCategories[category]}
                </h3>
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
