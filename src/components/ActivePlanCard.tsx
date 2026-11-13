import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Flag, Pause, Play, Plus, Settings2, X } from 'lucide-react'
import type { Destination, HabitKind, SavedPlan } from '../types'
import type { LifecycleProgress } from '../lib/calc'
import { useI18n } from '../i18n/context'
import { cn } from '../lib/cn'
import { DestinationImage } from './DestinationImage'
import { ProgressBar } from './ProgressBar'

export interface AllocatedHabitLine {
  habitId: string
  title: string
  monthly: number
}

export interface CreditedHabitLine {
  habitId: string
  title: string
  amount: number
}

export interface AvailableActivity {
  habitId: string
  title: string
  saving: number
  kind: HabitKind
}

interface ActivePlanCardProps {
  destination: Destination
  plan: SavedPlan
  progress: LifecycleProgress
  index: number
  allocated: AllocatedHabitLine[]
  credited: CreditedHabitLine[]
  available: AvailableActivity[]
  onPause: () => void
  onResume: () => void
  onAchieve: () => void
  onRemove: () => void
  onAddActivity: (habitId: string) => void
  onRemoveAllocation: (habitId: string) => void
}

export function ActivePlanCard({
  destination,
  plan,
  progress,
  index,
  allocated,
  credited,
  available,
  onPause,
  onResume,
  onAchieve,
  onRemove,
  onAddActivity,
  onRemoveAllocation,
}: ActivePlanCardProps) {
  const { copy, fmt, destinationText } = useI18n()
  const text = destinationText(destination)
  const [managing, setManaging] = useState(false)
  const status = plan.lifecycle?.status === 'paused' ? 'paused' : 'active'
  const href = `/destination/${destination.id}${
    plan.habitIds.length ? `?h=${plan.habitIds.join(',')}` : ''
  }`
  const a11yLabel = copy.a11y.progressPlan(destination.name)

  return (
    <article className="grid gap-6 border-b border-line py-8 lg:grid-cols-12 lg:gap-10">
      <Link
        to={href}
        className="relative block aspect-[16/10] overflow-hidden bg-ink lg:col-span-5"
        aria-label={destination.name}
      >
        <DestinationImage
          src={destination.image}
          alt={text.imageAlt}
          className="transition-transform duration-[1100ms] ease-out hover:scale-[1.03]"
        />
        <span className="absolute left-0 top-0 bg-canvas px-2.5 py-1.5 font-display text-sm font-semibold leading-none text-ink">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="absolute bottom-0 left-0 bg-accent px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
          {status === 'paused' ? copy.plan.status.paused : copy.plan.status.active}
        </span>
      </Link>

      <div className="flex min-w-0 flex-col lg:col-span-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
              {text.country} · {copy.plan.activatedOn}{' '}
              {plan.lifecycle?.activatedAt
                ? fmt.date(plan.lifecycle.activatedAt)
                : '—'}
            </p>
            <h2 className="mt-1.5 text-[clamp(2rem,4vw,3.2rem)] leading-[0.86] text-ink">
              {destination.name}
            </h2>
          </div>
          <div className="text-right">
            <p className="label">{copy.plan.estimated}</p>
            <p className="nums mt-1 text-[2rem] leading-none text-accent">
              {fmt.percent(progress.progress)}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <ProgressBar value={progress.progress} label={a11yLabel} />
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-line pt-4">
          <div>
            <dt className="label">{copy.unlocks.target}</dt>
            <dd className="nums mt-1 text-[14px] text-ink">
              {fmt.eur(destination.budget)}
            </dd>
          </div>
          <div>
            <dt className="label">{copy.plan.accumulated}</dt>
            <dd className="nums mt-1 text-[14px] text-ink">
              {fmt.eur(progress.accumulated)}
            </dd>
          </div>
          <div>
            <dt className="label">{copy.plan.remaining}</dt>
            <dd className="nums mt-1 text-[14px] text-ink">
              {fmt.eur(progress.remaining)}
            </dd>
          </div>
        </dl>

        <dl className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <dt className="label">{copy.plan.monthly}</dt>
            <dd className="nums mt-1 text-[13px] text-ink">
              {fmt.eur(progress.monthly)}
            </dd>
          </div>
          <div>
            <dt className="label">{copy.plan.timeRemaining}</dt>
            <dd className="nums mt-1 text-[13px] text-ink">
              {fmt.months(progress.monthsRemaining)}
            </dd>
          </div>
        </dl>

        <div className="mt-4 border-t border-line pt-3">
          <p className="label">{copy.plan.allocated}</p>
          <ul className="mt-2 space-y-1.5">
            {allocated.map((item) => (
              <li
                key={item.habitId}
                className="flex items-center justify-between gap-3 text-[12px] text-ink"
              >
                <span>{item.title}</span>
                <span className="flex items-center gap-2">
                  <span className="nums text-muted">
                    {fmt.eur(item.monthly)}
                    {copy.common.perMonth}
                  </span>
                  {managing && (
                    <button
                      type="button"
                      aria-label={`${copy.plan.removeAllocation} ${item.title}`}
                      onClick={() => onRemoveAllocation(item.habitId)}
                      className="text-muted transition-colors hover:text-accent"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </span>
              </li>
            ))}
            {credited.map((item) => (
              <li
                key={item.habitId}
                className="flex items-center justify-between gap-3 text-[12px] text-ink"
              >
                <span>{item.title}</span>
                <span className="nums text-muted">
                  {fmt.eur(item.amount)} · {copy.common.oneTime}
                </span>
              </li>
            ))}
            {allocated.length === 0 && credited.length === 0 && (
              <li className="text-[12px] text-muted">{copy.plan.emptyAvailable}</li>
            )}
          </ul>
        </div>

        {managing && (
          <div className="mt-4 border border-line bg-sky/30 p-3">
            <p className="label">{copy.plan.addActivity}</p>
            <p className="mt-1 text-[10px] leading-relaxed text-muted">
              {copy.plan.addActivityHint}
            </p>
            {available.length === 0 ? (
              <p className="mt-2 text-[11px] text-muted">{copy.plan.emptyAvailable}</p>
            ) : (
              <ul className="mt-2 grid gap-1">
                {available.map((item) => (
                  <li
                    key={item.habitId}
                    className="flex items-center justify-between gap-3 text-[12px] text-ink"
                  >
                    <span>{item.title}</span>
                    <button
                      type="button"
                      onClick={() => onAddActivity(item.habitId)}
                      className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-accent-dark transition-colors hover:text-ink"
                    >
                      <Plus className="h-3 w-3" />
                      {copy.plan.addActivity}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-5">
          <Link
            to={href}
            className="inline-flex items-center gap-1.5 border-b border-ink pb-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {copy.unlocks.openPlan}
            <ArrowUpRight className="h-3 w-3" />
          </Link>
          {status === 'paused' ? (
            <button
              type="button"
              onClick={onResume}
              className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent"
            >
              <Play className="h-3 w-3" />
              {copy.plan.resume}
            </button>
          ) : (
            <button
              type="button"
              onClick={onPause}
              className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent"
            >
              <Pause className="h-3 w-3" />
              {copy.plan.pause}
            </button>
          )}
          <button
            type="button"
            onClick={onAchieve}
            className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent"
          >
            <Flag className="h-3 w-3" />
            {copy.plan.achieve}
          </button>
          <button
            type="button"
            aria-expanded={managing}
            onClick={() => setManaging((current) => !current)}
            className={cn(
              'inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-accent',
              managing ? 'text-accent' : 'text-ink',
            )}
          >
            <Settings2 className="h-3 w-3" />
            {copy.plan.manage}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
          >
            {copy.unlocks.remove}
          </button>
        </div>

      </div>
    </article>
  )
}
