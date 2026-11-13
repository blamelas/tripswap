import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Destination } from '../types'
import { useI18n } from '../i18n/context'
import { cn } from '../lib/cn'
import { DestinationImage } from './DestinationImage'

interface DestinationCardProps {
  destination: Destination
  variant?: 'default' | 'tall' | 'wide'
  priority?: boolean
}

export function DestinationCard({
  destination,
  variant = 'default',
  priority = false,
}: DestinationCardProps) {
  const { copy, destinationText, fmt } = useI18n()
  const text = destinationText(destination)
  const budget = fmt.eur(destination.budget, { whole: true })
  const aspect =
    variant === 'tall'
      ? 'aspect-[4/5]'
      : variant === 'wide'
        ? 'aspect-[16/10]'
        : 'aspect-[4/3]'

  return (
    <article className="group">
      <Link
        to={`/destination/${destination.id}`}
        className="block focus-visible:outline-none"
        aria-label={copy.card.aria(destination.name, text.country, budget)}
      >
        <div className={cn('relative overflow-hidden bg-paper-2', aspect)}>
          <DestinationImage
            src={destination.image}
            alt={text.imageAlt}
            priority={priority}
            className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent" />

          <span className="absolute left-4 top-4 rounded-full border border-paper/30 bg-paper/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
            {copy.destinationCategories[destination.category]}
          </span>

          <div className="absolute bottom-4 right-4 text-right text-paper">
            <p className="font-display text-[2.6rem] leading-none">
              €0<span className="align-top text-base">*</span>
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-paper/75">
              {copy.card.withSwaps}
            </p>
          </div>

          <div className="absolute bottom-4 left-4 max-w-[62%] text-paper">
            <p className="text-[10px] uppercase tracking-[0.18em] text-paper/75">
              {text.country} · {copy.common.nights(destination.nights)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-5">
          <div>
            <h3 className="font-display text-[1.6rem] leading-tight text-ink">
              {destination.name}
            </h3>
            <p className="mt-1.5 text-sm text-ink-soft">{text.quote}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[9px] uppercase tracking-[0.18em] text-muted">
              {copy.common.objective}
            </p>
            <p className="nums mt-1 text-sm text-ink">{budget}</p>
          </div>
        </div>

        <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-clay">
          {copy.card.cta}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </p>
      </Link>
    </article>
  )
}
