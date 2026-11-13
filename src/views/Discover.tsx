import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowRight } from 'lucide-react'
import { DESTINATIONS } from '../data/destinations'
import { useI18n } from '../i18n/context'
import { DestinationCard } from '../components/DestinationCard'
import { DestinationImage } from '../components/DestinationImage'
import { PriceBlock } from '../components/PriceBlock'
import { cn } from '../lib/cn'

const flagship = DESTINATIONS.find((destination) => destination.id === 'paris-city-break')
const rest = DESTINATIONS.filter((destination) => destination.id !== flagship?.id)

const GRID = [
  { span: 'lg:col-span-7', variant: 'wide' as const },
  { span: 'lg:col-span-5', variant: 'tall' as const },
  { span: 'lg:col-span-4', variant: 'standard' as const },
  { span: 'lg:col-span-4', variant: 'standard' as const },
  { span: 'lg:col-span-4', variant: 'standard' as const },
  { span: 'lg:col-span-6', variant: 'wide' as const },
  { span: 'lg:col-span-6', variant: 'wide' as const },
]

export function Discover() {
  const { copy, destinationText } = useI18n()
  const featuredText = flagship ? destinationText(flagship) : null

  return (
    <div className="pb-4">
      <section className="page pt-4 lg:pt-6">
        <div className="grid lg:grid-cols-12">
          <div className="relative flex min-h-[430px] flex-col justify-between bg-ink p-6 text-canvas lg:col-span-5 lg:min-h-[640px] lg:p-10">
            <div className="flex items-center justify-between gap-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-canvas/60">
              <span>01 / {copy.discover.eyebrow}</span>
              <span>LISBON · 2026</span>
            </div>

            <h1 className="mt-8 text-[clamp(3.4rem,7vw,6.6rem)] leading-[0.79] tracking-tightest lg:mt-12">
              {copy.discover.headline.line1}
              <br />
              {copy.discover.headline.line2}
              <br />
              <span className="text-accent">{copy.discover.headline.accent}</span>
            </h1>

            <div className="mt-8 lg:mt-12">
              <p className="max-w-sm text-[13px] leading-relaxed text-canvas/60">
                {copy.discover.intro}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <a href="#destinations" className="btn-accent">
                  {copy.discover.ctaDestinations}
                  <ArrowDownRight className="h-3.5 w-3.5" />
                </a>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 border-b border-canvas/30 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-canvas/65 transition-colors hover:border-accent hover:text-accent"
                >
                  {copy.discover.ctaHow}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {flagship && (
            <div className="relative lg:col-span-7">
              <div className="relative h-[340px] overflow-hidden bg-ink sm:h-[440px] lg:h-[640px]">
                <DestinationImage
                  src={flagship.image}
                  alt={featuredText?.imageAlt ?? flagship.imageAlt}
                  priority
                  className="transition-transform duration-[1400ms] ease-out hover:scale-[1.025]"
                />
                <span className="absolute left-0 top-0 bg-canvas px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
                  {featuredText?.country ?? flagship.country} · 48.85° N
                </span>
                <span className="absolute bottom-4 left-4 bg-canvas px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
                  01 / {flagship.name}
                </span>
              </div>

              <div className="absolute bottom-0 right-0 bg-canvas p-4 lg:p-6">
                <PriceBlock budget={flagship.budget} size="md" />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-line py-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {copy.discover.stats.map((stat) => (
              <span
                key={stat}
                className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted"
              >
                {stat}
              </span>
            ))}
          </div>
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-accent-dark">
            Scroll ↓
          </span>
        </div>
      </section>

      <section className="page grid grid-cols-3 border-b border-line">
        {copy.discover.chapters.map((chapter, index) => (
          <div
            key={chapter}
            className={cn('py-5 lg:py-7', index > 0 && 'border-l border-line pl-4 lg:pl-8')}
          >
            <span className="nums text-[10px] text-accent">
              0{index + 1}
            </span>
            <p className="mt-1 font-display text-[clamp(1.5rem,3vw,2.5rem)] font-semibold uppercase leading-none text-ink">
              {chapter}
            </p>
          </div>
        ))}
      </section>

      <section id="destinations" className="page scroll-mt-20 pt-14 lg:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="label-accent">{copy.discover.catalogueEyebrow}</p>
            <h2 className="mt-2 text-[clamp(2.6rem,6vw,4.8rem)] leading-[0.82] text-ink">
              {copy.discover.catalogueTitle}
            </h2>
          </div>
          <p className="max-w-xs text-[12px] leading-relaxed text-muted">
            {copy.discover.catalogueIntro}
          </p>
        </div>

        {flagship && (
          <div className="mt-8">
            <DestinationCard
              destination={flagship}
              index={1}
              variant="flagship"
              priority
            />
          </div>
        )}

        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
          {rest.map((destination, index) => {
            const cell = GRID[index % GRID.length]
            return (
              <div key={destination.id} className={cn('h-full sm:col-span-1', cell.span)}>
                <DestinationCard
                  destination={destination}
                  index={index + 2}
                  variant={cell.variant}
                />
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-20 bg-sky">
        <div className="page grid gap-8 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14 lg:py-20">
          <div>
            <p className="label-accent">{copy.discover.zeroEyebrow}</p>
            <p className="mt-2 font-display text-[clamp(4.5rem,11vw,9rem)] font-semibold leading-[0.72] text-ink">
              €0<span className="align-top text-[0.24em]">*</span>
            </p>
          </div>

          <div>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] leading-[0.86] text-ink">
              {copy.discover.zeroTitle}
            </h2>
            <p className="mt-4 max-w-lg text-[13px] leading-relaxed text-ink/70">
              {copy.discover.zeroBody}
            </p>
            <p className="mt-4 max-w-lg text-[10px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-ink/65">
              {copy.price.metaphor}
            </p>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-accent"
            >
              {copy.discover.ruleLink}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
