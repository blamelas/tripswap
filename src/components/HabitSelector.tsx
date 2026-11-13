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
            className={index === 0 ? '' : 'mt-7'}
          >
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-1.5">
              <h3
                id={`cat-${category}`}
                className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted"
              >
                {copy.habitCategories[category]}
              </h3>
              <span className="nums text-[9px] text-muted">
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
