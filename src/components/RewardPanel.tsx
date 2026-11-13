import { BookmarkCheck, BookmarkPlus, Check } from 'lucide-react'
import type { Destination } from '../types'
import type { PlanResult } from '../lib/calc'
import { HORIZONS, planState } from '../lib/planState'
import { useI18n } from '../i18n/context'
import { cn } from '../lib/cn'
import { DestinationImage } from './DestinationImage'
import { NumberTicker } from './NumberTicker'

interface RewardWindowProps {
  destination: Destination
  plan: PlanResult
}

function RewardWindow({ destination, plan }: RewardWindowProps) {
  const { copy, fmt, destinationText } = useI18n()
  const text = destinationText(destination)
  const state = planState(plan)
  const progress = Math.max(0, Math.min(1, plan.progress))
  const months = plan.monthsToTarget
  const reached = plan.unlocked && months !== null

  return (
    <div className="border border-line">
      <div className={cn('relative aspect-[4/3] overflow-hidden bg-ink transition-shadow duration-500', reached && 'ring-2 ring-inset ring-accent')}>
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{ transform: `scale(${1 + progress * 0.05})` }}
        >
          <DestinationImage src={destination.image} alt={text.imageAlt} />
        </div>

        {/* The tide: the destination rises as the plan gets closer. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-accent/[0.08] transition-[height] duration-700 ease-out"
          style={{ height: `${progress * 100}%` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 h-[2px] bg-accent transition-[bottom] duration-700 ease-out"
          style={{ bottom: `${progress * 100}%` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-[3px] bg-canvas/25"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-0 top-0 w-[3px] bg-accent transition-[height] duration-700 ease-out"
          style={{ height: `${progress * 100}%` }}
          aria-hidden="true"
        />

        <div className="absolute left-0 top-0 bg-canvas px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
          {destination.name}
        </div>
        {plan.unlocked && (
          <div className="absolute right-0 top-0 flex items-center gap-1 bg-accent px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
            <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
            {copy.reward.unlocked}
          </div>
        )}
      </div>

      <div
        className={cn(
          'p-4 transition-colors duration-500',
          reached ? 'bg-accent text-ink' : 'bg-ink text-canvas',
        )}
      >
        <p className="sr-only" role="status" aria-live="polite">
          {reached ? `${copy.reward.reachedTitle} ${fmt.months(months)}` : ''}
        </p>

        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              'flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em]',
              reached ? 'text-ink/70' : 'text-canvas/65',
            )}
          >
            {reached && <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />}
            {reached ? copy.reward.reachedTitle : copy.reward.timeToReach}
          </span>
          <span
            className={cn(
              'text-[9px] font-semibold uppercase tracking-[0.16em]',
              reached ? 'text-ink/70' : 'text-canvas/65',
            )}
          >
            {reached ? copy.reward.unlockedShort : copy.panel.states[state].label}
          </span>
        </div>

        <div className="mt-1 flex items-end gap-2">
          {months !== null ? (
            <NumberTicker
              value={months}
              className={cn(
                'text-[4.4rem] leading-[0.8]',
                reached ? 'text-ink' : 'text-canvas',
              )}
            />
          ) : (
            <span
              className={cn(
                'text-[4.4rem] leading-[0.8]',
                reached ? 'text-ink' : 'text-canvas',
              )}
            >
              —
            </span>
          )}
          <span
            className={cn(
              'pb-1 text-[10px] font-semibold uppercase tracking-[0.14em]',
              reached ? 'text-ink/70' : 'text-canvas/60',
            )}
          >
            {months === 1 ? copy.reward.month : copy.reward.months}
          </span>
        </div>

        <p
          className={cn(
            'mt-2 min-h-[16px] text-[10px] leading-relaxed',
            reached ? 'text-ink/70' : 'text-canvas/70',
          )}
        >
          {reached ? copy.reward.simulation : copy.panel.saveNote}
        </p>

        <div
          className={cn(
            'mt-3 grid grid-cols-2 gap-3 border-t pt-3',
            reached ? 'border-ink/20' : 'border-canvas/15',
          )}
        >
          <div>
            <p
              className={cn(
                'text-[9px] font-semibold uppercase tracking-[0.16em]',
                reached ? 'text-ink/60' : 'text-canvas/60',
              )}
            >
              {copy.panel.perMonth}
            </p>
            <p className={cn('nums mt-0.5 text-[15px]', reached ? 'text-ink' : 'text-canvas')}>
              {fmt.eur(plan.monthly)}
            </p>
          </div>
          <div>
            <p
              className={cn(
                'text-[9px] font-semibold uppercase tracking-[0.16em]',
                reached ? 'text-ink/60' : 'text-canvas/60',
              )}
            >
              {copy.price.planningTarget}
            </p>
            <p className={cn('nums mt-0.5 text-[15px]', reached ? 'text-ink' : 'text-canvas')}>
              {fmt.eur(plan.target)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface RewardPanelProps {
  destination: Destination
  plan: PlanResult
  horizon: number
  onHorizon: (value: number) => void
  saved: boolean
  onSave: () => void
  className?: string
}

export function RewardPanel({
  destination,
  plan,
  horizon,
  onHorizon,
  saved,
  onSave,
  className,
}: RewardPanelProps) {
  const { copy } = useI18n()

  return (
    <div className={cn(className)}>
      <RewardWindow destination={destination} plan={plan} />

      <div className="border-x border-b border-line p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="label">{copy.panel.horizon}</span>
          <span className="label text-ink">
            {plan.habits.length} {copy.reward.selected}
          </span>
        </div>

        <div className="mt-2 flex gap-4">
          {HORIZONS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={horizon === value}
              onClick={() => onHorizon(value)}
              className={cn(
                'pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors',
                horizon === value
                  ? 'border-b-2 border-accent text-ink'
                  : 'text-muted hover:text-ink',
              )}
            >
              {value}m
            </button>
          ))}
        </div>

        <button type="button" onClick={onSave} className="btn-accent mt-4 w-full">
          {saved ? (
            <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
          ) : (
            <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
          )}
          {saved ? copy.panel.saved : copy.panel.save}
        </button>

        <p className="mt-3 text-[10px] leading-relaxed text-muted">
          {copy.panel.disclaimer}
        </p>
      </div>
    </div>
  )
}

interface MobileFundingBarProps {
  plan: PlanResult
  saved: boolean
  onSave: () => void
}

export function MobileFundingBar({ plan, saved, onSave }: MobileFundingBarProps) {
  const { copy, fmt } = useI18n()
  const state = planState(plan)
  const months = plan.monthsToTarget

  const reached = plan.unlocked && months !== null

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2.5 lg:hidden',
        reached ? 'bg-accent text-ink' : 'bg-ink text-canvas',
      )}
    >
      <div className={cn('absolute inset-x-0 top-0 h-[2px]', reached ? 'bg-ink/15' : 'bg-canvas/15')}>
        <div
          className={cn(
            'h-full transition-[width] duration-700',
            reached ? 'bg-ink' : 'bg-accent',
          )}
          style={{ width: `${Math.round(plan.progress * 100)}%` }}
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p
            className={cn(
              'flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.16em]',
              reached ? 'text-ink/70' : 'text-canvas/60',
            )}
          >
            {reached && <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />}
            {copy.panel.states[state].label}
          </p>
          <p className="mt-0.5 flex items-baseline gap-1.5">
            <span className={cn('nums text-lg', reached ? 'text-ink' : 'text-canvas')}>
              {months !== null ? `${months}` : '—'}
            </span>
            <span
              className={cn(
                'text-[10px] uppercase tracking-[0.12em]',
                reached ? 'text-ink/70' : 'text-canvas/70',
              )}
            >
              {months === 1 ? copy.reward.month : copy.reward.months}
            </span>
            <span className={cn('nums text-[10px]', reached ? 'text-ink/70' : 'text-canvas/70')}>
              · {fmt.eur(plan.monthly)}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className={cn(
            'flex shrink-0 items-center gap-1.5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em]',
            reached ? 'bg-ink text-canvas' : 'bg-accent text-ink',
          )}
        >
          {saved ? (
            <BookmarkCheck className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <BookmarkPlus className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {saved ? copy.common.saved : copy.common.save}
        </button>
      </div>
    </div>
  )
}
