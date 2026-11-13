import { Check } from 'lucide-react'
import type { Habit } from '../types'
import { useI18n } from '../i18n/context'
import { cn } from '../lib/cn'

interface HabitCardProps {
  habit: Habit
  selected: boolean
  replacedHabit?: Habit
  onToggle: (habit: Habit) => void
}

export function HabitCard({ habit, selected, replacedHabit, onToggle }: HabitCardProps) {
  const { copy, habitText, benefitLabel, fmt } = useI18n()
  const text = habitText(habit)
  const isRecurring = habit.kind === 'recurring'

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onToggle(habit)}
      className={cn(
        'group flex w-full items-start gap-3 border-b border-line px-1 py-4 text-left transition-colors lg:gap-4 lg:px-2',
        selected ? 'bg-sky/55' : 'hover:bg-sky/25',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors',
          selected
            ? 'border-accent bg-accent text-ink'
            : 'border-ink/30 text-transparent group-hover:border-ink',
        )}
        aria-hidden="true"
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-4">
          <span className="text-[14.5px] font-medium leading-snug text-ink">
            {text.title}
          </span>
          <span className="nums shrink-0 text-[14px] text-accent-dark">
            {fmt.eur(habit.saving)}
            <span className="ml-1 font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
              {isRecurring ? copy.common.perMonth : copy.common.oneTime}
            </span>
          </span>
        </span>

        <span className="mt-1 block max-w-xl text-[12px] leading-relaxed text-muted">
          {text.description}
        </span>

        {(habit.benefits.length > 0 || replacedHabit) && (
          <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-semibold uppercase tracking-[0.12em]">
            {habit.benefits.map((benefit) => (
              <span key={benefit} className="text-muted">
                {benefitLabel(benefit)}
              </span>
            ))}
            {replacedHabit && (
              <span className="normal-case tracking-normal text-accent-dark">
                {copy.habitCard.replacement(habitText(replacedHabit).title)}
              </span>
            )}
          </span>
        )}
      </span>
    </button>
  )
}
