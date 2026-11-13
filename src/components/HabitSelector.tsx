import type { Habit } from '../types'
import { HABITS, HABIT_CATEGORY_ORDER } from '../data/habits'
import { conflictWith } from '../lib/conflicts'
import { HabitCard } from './HabitCard'
import { HabitCategorySection } from './HabitCategorySection'

interface HabitSelectorProps {
  selectedIds: string[]
  onToggle: (habit: Habit) => void
}

export function HabitSelector({ selectedIds, onToggle }: HabitSelectorProps) {
  return (
    <div>
      {HABIT_CATEGORY_ORDER.map((category, index) => {
        const habits = HABITS.filter((habit) => habit.category === category)
        const selectedCount = habits.filter((habit) =>
          selectedIds.includes(habit.id),
        ).length

        return (
          <HabitCategorySection
            key={category}
            category={category}
            available={habits.length}
            selected={selectedCount}
            className={index === 0 ? '' : 'mt-9'}
          >
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                selected={selectedIds.includes(habit.id)}
                replacedHabit={conflictWith(selectedIds, habit, HABITS)}
                onToggle={onToggle}
              />
            ))}
          </HabitCategorySection>
        )
      })}
    </div>
  )
}
