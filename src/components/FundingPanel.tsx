import { BookmarkCheck, BookmarkPlus, Lock, LockOpen } from 'lucide-react'
import type { PlanResult } from '../lib/calc'
import { HORIZONS, planState } from '../lib/planState'
import { useI18n } from '../i18n/context'
import { ProgressRail } from './ProgressRail'
import { NumberTicker } from './NumberTicker'
import { cn } from '../lib/cn'

interface HorizonPickerProps {
  value: number
  onChange: (value: number) => void
}

export function HorizonPicker({ value, onChange }: HorizonPickerProps) {
  const { copy } = useI18n()

  return (
    <div>
      <p className="eyebrow">{copy.panel.horizon}</p>
      <div
        className="mt-2 grid grid-cols-4 gap-1"
        role="group"
        aria-label={copy.panel.horizon}
      >
        {HORIZONS.map((horizon) => (
          <button
            key={horizon}
            type="button"
            aria-pressed={value === horizon}
            onClick={() => onChange(horizon)}
            className={cn(
              'border py-2 text-[12px] font-medium transition-colors',
              value === horizon
                ? 'border-ink bg-ink text-paper'
                : 'border-line text-muted hover:border-ink/50 hover:text-ink',
            )}
          >
            {horizon}m
          </button>
        ))}
      </div>
    </div>
  )
}

interface FundingPanelProps {
  plan: PlanResult
  horizon: number
  onHorizon: (value: number) => void
  saved: boolean
  onSave: () => void
  className?: string
}

export function FundingPanel({
  plan,
  horizon,
  onHorizon,
  saved,
  onSave,
  className,
}: FundingPanelProps) {
  const { copy, fmt } = useI18n()
  const state = planState(plan)
  const stateCopy = copy.panel.states[state]

  return (
    <div className={cn('border border-line bg-white/70 p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">{stateCopy.label}</p>
        <span
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-full',
            state === 'unlocked' ? 'bg-clay text-paper' : 'bg-paper-2 text-ink-soft',
          )}
          aria-hidden="true"
        >
          {state === 'unlocked' ? (
            <LockOpen className="h-3.5 w-3.5" />
          ) : (
            <Lock className="h-3.5 w-3.5" />
          )}
        </span>
      </div>

      <div className="mt-4">
        {plan.monthsToTarget !== null ? (
          <>
            <p className="flex items-baseline gap-2">
              <NumberTicker
                value={plan.monthsToTarget}
                className="text-[3.4rem] leading-none text-ink"
              />
              <span className="text-sm text-muted">
                {copy.panel.monthsSuffix(plan.monthsToTarget)}
              </span>
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">
              {copy.panel.targetNote(fmt.eur(plan.target))}
            </p>
          </>
        ) : (
          <p className="font-display text-2xl leading-tight text-ink">{stateCopy.hint}</p>
        )}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.14em] text-muted">
            {copy.panel.perMonth}
          </dt>
          <dd className="nums mt-1 text-lg text-ink">{fmt.eur(plan.monthly)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.14em] text-muted">
            {copy.panel.oneTime}
          </dt>
          <dd className="nums mt-1 text-lg text-ink">{fmt.eur(plan.oneTime)}</dd>
        </div>
      </dl>

      <ProgressRail
        className="mt-5"
        progress={plan.progress}
        unlocked={plan.unlocked}
        label={copy.a11y.progressHorizon(fmt.months(horizon))}
      />
      <div className="mt-2 flex justify-between text-[11px] text-muted">
        <span>{copy.panel.progress(fmt.percent(plan.progress), fmt.months(horizon))}</span>
        <span className="nums">
          {plan.unlocked
            ? copy.common.reached
            : copy.panel.remaining(fmt.eur(plan.remainingAtHorizon))}
        </span>
      </div>

      <div className="mt-6">
        <HorizonPicker value={horizon} onChange={onHorizon} />
      </div>

      <button type="button" onClick={onSave} className="btn-primary mt-5 w-full">
        {saved ? (
          <>
            <BookmarkCheck className="h-4 w-4" /> {copy.panel.saved}
          </>
        ) : (
          <>
            <BookmarkPlus className="h-4 w-4" /> {copy.panel.save}
          </>
        )}
      </button>

      <p className="mt-3 text-[10px] leading-relaxed text-muted">{copy.panel.disclaimer}</p>
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

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/15 bg-paper px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 lg:hidden">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-line">
        <div
          className={cn(
            'h-full transition-all duration-700',
            plan.unlocked ? 'bg-clay' : 'bg-ink',
          )}
          style={{ width: `${Math.round(plan.progress * 100)}%` }}
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
            {copy.panel.states[state].label}
          </p>
          <p className="mt-0.5 flex items-baseline gap-1.5 truncate">
            <span className="nums text-xl text-ink">
              {plan.monthsToTarget !== null ? fmt.months(plan.monthsToTarget) : '—'}
            </span>
            <span className="nums text-[11px] text-muted">
              · {fmt.eur(plan.monthly)}
              {copy.common.perMonth}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="btn-primary shrink-0 px-3 py-2.5 text-[12px]"
        >
          {saved ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <BookmarkPlus className="h-4 w-4" />
          )}
          {saved ? copy.common.saved : copy.common.save}
        </button>
      </div>
    </div>
  )
}
