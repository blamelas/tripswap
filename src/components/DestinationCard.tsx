import { Link } from 'react-router-dom'
import type { Destination } from '../types'
import { useI18n } from '../i18n/context'
import { cn } from '../lib/cn'
import { DestinationImage } from './DestinationImage'
import { PriceBlock } from './PriceBlock'

type TileVariant = 'flagship' | 'wide' | 'tall' | 'standard'

interface DestinationCardProps {
  destination: Destination
  index: number
  variant?: TileVariant
  priority?: boolean
}

const ASPECT: Record<TileVariant, string> = {
  flagship: 'aspect-[4/3] lg:aspect-[16/7]',
  wide: 'aspect-[16/10]',
  tall: 'aspect-[4/5]',
  standard: 'aspect-[4/3]',
}

export function DestinationCard({
  destination,
  index,
  variant = 'standard',
  priority = false,
}: DestinationCardProps) {
  const { copy, destinationText, fmt } = useI18n()
  const text = destinationText(destination)
  const budget = fmt.eur(destination.budget, { whole: true })
  const number = String(index).padStart(2, '0')

  if (variant === 'flagship') {
    return (
      <Link
        to={`/destination/${destination.id}`}
        className="group block"
        aria-label={copy.card.aria(destination.name, text.country, budget)}
      >
        <div className={cn('relative overflow-hidden bg-ink', ASPECT.flagship)}>
          <DestinationImage
            src={destination.image}
            alt={text.imageAlt}
            priority={priority}
            className="transition-transform duration-[1100ms] ease-out group-hover:scale-[1.03]"
          />

          <span className="absolute left-0 top-0 bg-canvas px-3 py-2 font-display text-lg font-semibold leading-none text-ink">
            {number}
          </span>

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 bg-ink p-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:p-8">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-canvas/45">
                {copy.destinationCategories[destination.category]} · {text.country} ·{' '}
                {copy.common.nights(destination.nights)}
              </p>
              <h3 className="mt-2 text-[clamp(2.5rem,6vw,5rem)] leading-[0.84] text-canvas transition-colors group-hover:text-accent">
                {destination.name}
              </h3>
              <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-canvas/55">
                {text.quote}
              </p>
            </div>
            <PriceBlock
              budget={destination.budget}
              size="sm"
              tone="dark"
              className="shrink-0"
            />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/destination/${destination.id}`}
      className="group flex h-full flex-col"
      aria-label={copy.card.aria(destination.name, text.country, budget)}
    >
      <div className={cn('relative overflow-hidden bg-ink', ASPECT[variant])}>
        <DestinationImage
          src={destination.image}
          alt={text.imageAlt}
          priority={priority}
          className="transition-transform duration-[1100ms] ease-out group-hover:scale-[1.035]"
        />
        <span className="absolute left-0 top-0 bg-canvas px-2.5 py-1.5 font-display text-sm font-semibold leading-none text-ink">
          {number}
        </span>
      </div>

      <div className="mt-3 flex items-start justify-between gap-4 border-t border-line pt-3">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
            {copy.destinationCategories[destination.category]} · {text.country}
          </p>
          <h3 className="mt-1 text-[clamp(1.7rem,2.6vw,2.4rem)] leading-[0.9] text-ink transition-colors group-hover:text-accent">
            {destination.name}
          </h3>
          <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-muted">
            {copy.common.nights(destination.nights)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="nums text-[11px] text-muted line-through decoration-1">
            {budget}
          </p>
          <p className="font-display text-[2.1rem] font-semibold leading-none text-accent">
            €0*
          </p>
        </div>
      </div>
    </Link>
  )
}
