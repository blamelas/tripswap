import { Check, RotateCcw } from 'lucide-react'
import type { Habit } from '../types'
import { formatEUR } from '../lib/format'
import { cn } from '../lib/cn'

interface HabitCardProps {
  habit: Habit
  selected: boolean
  replacedHabit?: Habit
  onToggle: (habit: Habit) => void
}

export function HabitCard({ habit, selected, replacedHabit, onToggle }: HabitCardProps) {
  const isRecurring = habit.kind === 'recurring'

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onToggle(habit)}
      className={cn(
        'group relative flex h-full w-full flex-col border p-4 text-left transition-all duration-200 sm:p-5',
        selected
          ? 'border-ink bg-white shadow-lift'
          : 'border-line bg-white/40 hover:border-ink/40 hover:bg-white/70',
      )}
    >
      <span
        className={cn(
          'absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border transition-colors sm:right-5 sm:top-5',
          selected ? 'border-clay bg-clay text-paper' : 'border-line text-transparent',
        )}
        aria-hidden="true"
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>

      <div className="pr-9">
        <h4 className="text-[15px] font-semibold leading-snug text-ink">{habit.title}</h4>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{habit.description}</p>
      </div>

      <div className="mt-auto pt-4">
        <p className="nums text-lg text-clay">
          {formatEUR(habit.saving)}
          <span className="ml-1 font-sans text-[11px] font-medium text-muted">
            {isRecurring ? '/ mês' : 'uma vez'}
          </span>
        </p>

        {habit.benefits.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {habit.benefits.map((benefit) => (
              <span
                key={benefit}
                className="rounded-full bg-moss-soft px-2 py-0.5 text-[10px] font-medium text-moss"
              >
                {benefit}
              </span>
            ))}
          </div>
        )}

        {replacedHabit && (
          <p className="mt-3 flex items-start gap-1.5 border-t border-clay-soft pt-2.5 text-[11px] leading-relaxed text-clay-dark">
            <RotateCcw className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
            Substitui “{replacedHabit.title}”: as duas assumem as mesmas despesas.
          </p>
        )}
      </div>
    </button>
  )
}
