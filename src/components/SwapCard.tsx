import { createElement } from 'react'
import { Check, Plus } from 'lucide-react'
import type { Habit } from '../types'
import { DESTINATIONS } from '../data/destinations'
import { useI18n } from '../i18n/context'
import { monthsToTarget } from '../lib/calc'
import { HABIT_CATEGORY_META } from '../lib/habitCategories'
import { habitIcon } from '../lib/habitIcons'
import { cn } from '../lib/cn'

const cheapest = DESTINATIONS.reduce((first, next) =>
  first.budget <= next.budget ? first : next,
)

interface SwapCardProps {
  habit: Habit
  selected: boolean
  onToggle: (habit: Habit) => void
}

export function SwapCard({ habit, selected, onToggle }: SwapCardProps) {
  const { copy, habitText, fmt } = useI18n()
  const text = habitText(habit)
  const meta = HABIT_CATEGORY_META[habit.category]

  const monthly = habit.kind === 'recurring' ? habit.saving : 0
  const oneTime = habit.kind === 'one-time' ? habit.saving : 0
  const months = monthsToTarget(cheapest.budget, monthly, oneTime)
  const experience = months
    ? copy.swaps.alone(cheapest.name, fmt.months(months))
    : oneTime > 0
      ? copy.swaps.start(cheapest.name)
      : copy.swaps.leads

  const formula =
    habit.kind === 'recurring'
      ? `(${fmt.eur(habit.originalCost)} − ${fmt.eur(habit.alternativeCost)}) × ${habit.monthlyFrequency}`
      : `${fmt.eur(habit.originalCost)} − ${fmt.eur(habit.alternativeCost)}`

  return (
    <article
      className={cn(
        'relative flex h-full flex-col overflow-hidden border border-line p-4 transition-colors',
        selected ? 'border-ink bg-sky/35' : 'bg-white/25',
      )}
    >
      <div
        aria-hidden="true"
        className={cn('-mx-4 -mt-4 mb-3 h-5', meta.bar)}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center',
              meta.soft,
              meta.color,
            )}
            aria-hidden="true"
          >
            {createElement(habitIcon(habit.id), {
              className: 'h-4 w-4',
              strokeWidth: 2.1,
              'aria-hidden': true,
            })}
          </span>
          <h3 className="text-[20px] leading-[0.98] text-ink">{text.title}</h3>
        </div>
        {selected && (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center text-ink">
            <Check className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
          </span>
        )}
      </div>

      <p className="mt-2 text-[12px] leading-relaxed text-muted">{text.description}</p>

      <div className="mt-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
          {habit.kind === 'recurring' ? copy.swaps.monthly : copy.swaps.oneTime}
        </p>
        <p className="nums mt-1 text-[2.1rem] leading-none text-accent-dark">
          {fmt.eur(habit.saving)}
          <span className="ml-1 font-sans text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
            {habit.kind === 'recurring' ? copy.common.perMonth : copy.common.oneTime}
          </span>
        </p>
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-muted">{experience}</p>

      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onToggle(habit)}
        className={cn(
          'mt-5 inline-flex w-full items-center justify-center gap-2 border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors',
          selected
            ? 'border-ink bg-ink text-canvas'
            : 'border-ink text-ink hover:bg-ink hover:text-canvas',
        )}
      >
        {selected ? (
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {selected ? copy.swaps.added : copy.swaps.add}
      </button>

      <details className="mt-3 border-t border-line pt-2 text-[10px] text-muted">
        <summary className="cursor-pointer text-[9px] font-semibold uppercase tracking-[0.12em]">
          {copy.swaps.assumptions}
        </summary>
        <p className="mt-2 leading-relaxed">{text.assumptions}</p>
        <p className="nums mt-1 text-[10px] text-ink">{formula}</p>
      </details>
    </article>
  )
}
