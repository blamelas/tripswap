import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import type { GamesEstimate, Habit } from '../types'
import { useI18n } from '../i18n/context'
import { GamesFields } from './GamesFields'
import { hasGamesSaving } from '../lib/habitValues'
import { cn } from '../lib/cn'

interface HabitCardProps {
  habit: Habit
  selected: boolean
  replacedHabit?: Habit
  onToggle: (habit: Habit) => void
  gamesEstimate: GamesEstimate | null
  onGamesEstimateChange: (estimate: GamesEstimate) => void
}

export function HabitCard({
  habit,
  selected,
  replacedHabit,
  onToggle,
  gamesEstimate,
  onGamesEstimateChange,
}: HabitCardProps) {
  const { copy, habitText, benefitLabel, fmt } = useI18n()
  const text = habitText(habit)
  const isRecurring = habit.kind === 'recurring'
  const isGames = Boolean(habit.customExpense)
  const gamesReady = hasGamesSaving(gamesEstimate)
  const canSelect = !isGames || gamesReady
  const [open, setOpen] = useState(isGames)
  const detailsId = `habit-${habit.id}-details`

  return (
    <div
      className={cn(
        'border-b border-line transition-colors',
        selected ? 'bg-sky/50' : 'hover:bg-sky/25',
      )}
    >
      <div className="flex items-center gap-2 py-3">
        <button
          type="button"
          aria-pressed={selected}
          disabled={!canSelect}
          onClick={() => onToggle(habit)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left disabled:cursor-not-allowed"
        >
          <span
            className={cn(
              'flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors',
              selected
                ? 'border-accent bg-accent text-ink'
                : 'border-ink/30 text-transparent',
            )}
            aria-hidden="true"
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-4">
              <span className="text-[14px] font-medium leading-snug text-ink">
                {text.title}
              </span>
              {isGames && !gamesReady ? (
                <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.1em] text-accent-dark">
                  {copy.games.setFirst}
                </span>
              ) : (
                <span className="nums shrink-0 text-[13.5px] text-accent-dark">
                  {fmt.eur(habit.saving)}
                  <span className="ml-1 font-sans text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
                    {isRecurring ? copy.common.perMonth : copy.common.oneTime}
                  </span>
                </span>
              )}
            </span>

            {replacedHabit && (
              <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.1em] text-accent-dark">
                {copy.habitCard.overlap}
              </span>
            )}
          </span>
        </button>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailsId}
          aria-label={copy.habitCard.details}
          onClick={() => setOpen((value) => !value)}
          className="flex h-8 w-8 shrink-0 items-center justify-center text-muted transition-colors hover:text-ink"
        >
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
            aria-hidden="true"
          />
        </button>
      </div>

      {open && (
        <div id={detailsId} className="pb-3 pl-[30px] pr-10">
          <p className="text-[11.5px] leading-relaxed text-muted">{text.description}</p>
          {isGames ? (
            <>
              <GamesFields estimate={gamesEstimate} onSave={onGamesEstimateChange} />
              <p className="mt-2 text-[10px] leading-relaxed text-muted">
                {text.assumptions}
              </p>
            </>
          ) : (
            <>
          <p className="mt-1.5 text-[10px] leading-relaxed text-muted">
            <span className="font-semibold uppercase tracking-[0.1em]">
              {copy.habitCard.assumptionLabel}:
            </span>{' '}
            {text.assumptions}
          </p>
          {habit.benefits.length > 0 && (
            <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
              {habit.benefits.map((benefit) => benefitLabel(benefit)).join(' · ')}
            </p>
          )}
          {replacedHabit && (
            <p className="mt-1.5 text-[10px] leading-relaxed text-accent-dark">
              {copy.habitCard.replacement(habitText(replacedHabit).title)}
            </p>
          )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
