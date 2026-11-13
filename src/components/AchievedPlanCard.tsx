import { Link } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import type { Destination, SavedPlan } from '../types'
import { useI18n } from '../i18n/context'
import { DestinationImage } from './DestinationImage'

interface AchievedPlanCardProps {
  saved: SavedPlan
  destination: Destination
  index: number
  onRemove: () => void
}

export function AchievedPlanCard({
  saved,
  destination,
  index,
  onRemove,
}: AchievedPlanCardProps) {
  const { copy, fmt, destinationText } = useI18n()
  const text = destinationText(destination)
  const href = `/destination/${destination.id}${
    saved.habitIds.length ? `?h=${saved.habitIds.join(',')}` : ''
  }`
  const achievedAt = saved.lifecycle?.achievedAt

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
      </Link>

      <div className="flex min-w-0 flex-col lg:col-span-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-moss">
              <Check className="h-3 w-3" strokeWidth={3} />
              {copy.plan.status.achieved}
            </p>
            <h2 className="mt-1.5 text-[clamp(2rem,4vw,3.2rem)] leading-[0.86] text-ink">
              {destination.name}
            </h2>
          </div>
          <div className="text-right">
            <p className="label">{copy.plan.achievedOn}</p>
            <p className="nums mt-1 text-[1.4rem] leading-none text-moss">
              {achievedAt ? fmt.date(achievedAt) : '—'}
            </p>
          </div>
        </div>

        <p className="mt-2 max-w-lg text-[12px] leading-relaxed text-muted">
          {copy.plan.achievedNote}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4">
          <div>
            <dt className="label">{copy.unlocks.target}</dt>
            <dd className="nums mt-1 text-[14px] text-ink">
              {fmt.eur(destination.budget)}
            </dd>
          </div>
          <div>
            <dt className="label">{copy.unlocks.swaps}</dt>
            <dd className="nums mt-1 text-[14px] text-ink">{saved.habitIds.length}</dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap items-center gap-5 pt-5">
          <Link
            to={href}
            className="inline-flex items-center gap-1.5 border-b border-ink pb-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-accent hover:text-accent"
          >
            {copy.unlocks.openPlan}
            <ArrowUpRight className="h-3 w-3" />
          </Link>
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
