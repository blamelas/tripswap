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

  return (
    <div className="border border-line">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
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
          <div className="absolute right-0 top-0 bg-accent px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
            {copy.reward.unlocked}
          </div>
        )}
      </div>

      <div className="bg-ink p-4 text-canvas">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-canvas/50">
            {copy.reward.timeToReach}
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-canvas/50">
            {copy.panel.states[state].label}
          </span>
        </div>

        <div className="mt-1 flex items-end gap-2">
          {months !== null ? (
            <NumberTicker
              value={months}
              className="text-[4.4rem] leading-[0.8] text-canvas"
            />
          ) : (
            <span className="text-[4.4rem] leading-[0.8] text-canvas">—</span>
          )}
          <span className="pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-canvas/60">
            {months === 1 ? copy.reward.month : copy.reward.months}
          </span>
        </div>

        {months === null && (
          <p className="mt-2 text-[11px] leading-relaxed text-canvas/55">
            {copy.panel.states[state].hint}
          </p>
        )}

        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-canvas/15 pt-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-canvas/45">
              {copy.panel.perMonth}
            </p>
            <p className="nums mt-0.5 text-[15px] text-canvas">{fmt.eur(plan.monthly)}</p>
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-canvas/45">
              {copy.price.planningTarget}
            </p>
            <p className="nums mt-0.5 text-[15px] text-canvas">{fmt.eur(plan.target)}</p>
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

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-ink px-4 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2.5 text-canvas lg:hidden">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-canvas/15">
        <div
          className="h-full bg-accent transition-[width] duration-700"
          style={{ width: `${Math.round(plan.progress * 100)}%` }}
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-canvas/45">
            {copy.panel.states[state].label}
          </p>
          <p className="mt-0.5 flex items-baseline gap-1.5">
            <span className="nums text-lg text-canvas">
              {months !== null ? `${months}` : '—'}
            </span>
            <span className="text-[10px] uppercase tracking-[0.12em] text-canvas/55">
              {months === 1 ? copy.reward.month : copy.reward.months}
            </span>
            <span className="nums text-[10px] text-canvas/55">
              · {fmt.eur(plan.monthly)}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="shrink-0 bg-accent px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink"
        >
          {saved ? copy.common.saved : copy.common.save}
        </button>
      </div>
    </div>
  )
}
