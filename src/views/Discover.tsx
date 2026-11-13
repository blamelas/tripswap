import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowRight } from 'lucide-react'
import { DESTINATIONS } from '../data/destinations'
import { useI18n } from '../i18n/context'
import { DestinationCard } from '../components/DestinationCard'
import { cn } from '../lib/cn'

const featured = DESTINATIONS.find((destination) => destination.id === 'paris-city-break')
const rest = DESTINATIONS.filter((destination) => destination.id !== featured?.id)

const GRID = [
  { span: 'lg:col-span-7', variant: 'wide' as const },
  { span: 'lg:col-span-5', variant: 'tall' as const },
  { span: 'lg:col-span-4', variant: 'default' as const },
  { span: 'lg:col-span-4', variant: 'default' as const },
  { span: 'lg:col-span-4', variant: 'default' as const },
  { span: 'lg:col-span-6', variant: 'wide' as const },
  { span: 'lg:col-span-6', variant: 'wide' as const },
]

export function Discover() {
  const { copy, fmt } = useI18n()

  return (
    <div className="pb-16">
      <section className="page grid items-end gap-12 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-20 lg:pt-16">
        <div className="animate-rise">
          <p className="eyebrow">{copy.discover.eyebrow}</p>
          <h1 className="mt-5 font-display text-[clamp(2.9rem,7.4vw,5.8rem)] font-normal leading-[0.92] tracking-tightest text-ink">
            {copy.discover.headline.line1}
            <br />
            {copy.discover.headline.line2}
            <br />
            <em className="italic text-clay">{copy.discover.headline.accent}</em>
          </h1>
          <p className="mt-7 max-w-lg text-pretty text-[17px] leading-relaxed text-ink-soft">
            {copy.discover.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#destinos" className="btn-primary">
              {copy.discover.ctaDestinations}
              <ArrowDownRight className="h-4 w-4" />
            </a>
            <Link to="/about" className="btn-ghost">
              {copy.discover.ctaHow}
            </Link>
          </div>

          <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.14em] text-muted">
            {copy.discover.stats.map((stat, index) => (
              <Fragment key={stat}>
                {index > 0 && (
                  <span className="hidden sm:inline" aria-hidden="true">
                    ·
                  </span>
                )}
                <span>{stat}</span>
              </Fragment>
            ))}
          </p>
        </div>

        {featured && (
          <div className="animate-fade lg:pb-2" style={{ animationDelay: '120ms' }}>
            <DestinationCard destination={featured} variant="tall" priority />
            <p className="mt-3 text-right text-[10px] uppercase tracking-[0.14em] text-muted">
              {copy.discover.featuredNote(fmt.eur(featured.budget))}
            </p>
          </div>
        )}
      </section>

      <section className="border-y border-line bg-white/35">
        <div className="page grid gap-8 py-8 sm:grid-cols-3 sm:gap-6">
          {copy.discover.steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <span className="nums pt-0.5 text-[11px] text-clay">{step.number}</span>
              <div>
                <h2 className="font-display text-xl text-ink">{step.title}</h2>
                <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="destinos" className="page scroll-mt-20 pt-16">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className="eyebrow">{copy.discover.catalogueEyebrow}</p>
            <h2 className="mt-2 font-display text-[clamp(2rem,4vw,3rem)] leading-none text-ink">
              {copy.discover.catalogueTitle}
            </h2>
          </div>
          <p className="max-w-sm text-[13px] leading-relaxed text-muted">
            {copy.discover.catalogueIntro}
          </p>
        </div>

        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
          {rest.map((destination, index) => {
            const cell = GRID[index % GRID.length]
            return (
              <div key={destination.id} className={cn('sm:col-span-1', cell.span)}>
                <DestinationCard destination={destination} variant={cell.variant} />
              </div>
            )
          })}
        </div>
      </section>

      <section className="page mt-20">
        <div className="grid gap-8 border border-line bg-white/50 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow">{copy.discover.zeroEyebrow}</p>
            <h2 className="mt-3 max-w-lg font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight text-ink">
              {copy.discover.zeroTitle}
            </h2>
            <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-ink-soft">
              {copy.discover.zeroBody}
            </p>
          </div>
          <div className="border-l-0 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
              {copy.discover.ruleLabel}
            </p>
            <p className="mt-3 font-display text-xl leading-snug text-ink">
              {copy.discover.ruleQuote}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              {copy.discover.ruleBody}
            </p>
            <Link
              to="/about"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-clay"
            >
              {copy.discover.ruleLink}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
