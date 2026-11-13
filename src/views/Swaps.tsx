import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, PenLine } from 'lucide-react'
import type { Habit } from '../types'
import { DESTINATIONS } from '../data/destinations'
import { HABITS, HABIT_CATEGORY_ORDER, getHabit } from '../data/habits'
import { useI18n } from '../i18n/context'
import { summarizeSavings } from '../lib/calc'
import { toggleHabit } from '../lib/conflicts'
import {
  readSwapSelection,
  writeSwapSelection,
} from '../lib/storage'
import { DestinationImage } from '../components/DestinationImage'
import { HabitCategorySection } from '../components/HabitCategorySection'
import { SwapCard } from '../components/SwapCard'

export function Swaps() {
  const { copy, fmt, destinationText } = useI18n()
  const [selected, setSelected] = useState<string[]>(() => readSwapSelection())

  function handleToggle(habit: Habit) {
    const next = toggleHabit(selected, habit, HABITS)
    setSelected(next)
    writeSwapSelection(next)
  }

  const selectedHabits = selected
    .map((id) => getHabit(id))
    .filter((habit): habit is Habit => habit !== undefined)
  const summary = summarizeSavings(selectedHabits)
  const query = selected.length ? `?h=${selected.join(',')}` : ''

  return (
    <div className="pb-16">
      <section className="page pt-10 lg:pt-16">
        <p className="label-accent">{copy.swaps.eyebrow}</p>
        <h1 className="mt-3 max-w-6xl text-[clamp(2.8rem,6.6vw,5.8rem)] leading-[0.8] tracking-tightest text-ink">
          {copy.swaps.headline.line1}
          <br />
          <span className="text-accent">{copy.swaps.headline.line2}</span>
        </h1>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <p className="max-w-2xl text-[14px] leading-relaxed text-ink-soft">
            {copy.swaps.intro}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted lg:text-right">
            {HABITS.length} {copy.swaps.swapCount} · {HABIT_CATEGORY_ORDER.length}{' '}
            {copy.swaps.categoryCount}
          </p>
        </div>
      </section>

      <div className="sticky top-14 z-30 mt-8 border-y border-canvas/15 bg-ink text-canvas lg:top-16">
        <div className="page flex flex-wrap items-center justify-between gap-3 py-2.5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-canvas/60">
              {summary.habits.length} {copy.swaps.selected}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-canvas/60">
              {copy.swaps.monthly}{' '}
              <span className="nums ml-1 text-[13px] text-canvas">
                {fmt.eur(summary.monthly)}
              </span>
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-canvas/60">
              {copy.swaps.oneTime}{' '}
              <span className="nums ml-1 text-[13px] text-canvas">
                {fmt.eur(summary.oneTime)}
              </span>
            </span>
          </div>

          <a
            href="#destinations"
            className="inline-flex items-center gap-1.5 bg-accent px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-canvas"
          >
            <span className="hidden sm:inline">{copy.swaps.cta}</span>
            <span className="sm:hidden">{copy.swaps.ctaShort}</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>

      <section className="page mt-10 lg:mt-14">
        {HABIT_CATEGORY_ORDER.map((category, index) => {
          const habits = HABITS.filter((habit) => habit.category === category)
          const selectedCount = habits.filter((habit) =>
            selected.includes(habit.id),
          ).length

          return (
            <HabitCategorySection
              key={category}
              category={category}
              available={habits.length}
              selected={selectedCount}
              className={index === 0 ? '' : 'mt-10'}
            >
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {habits.map((habit) => (
                  <SwapCard
                    key={habit.id}
                    habit={habit}
                    selected={selected.includes(habit.id)}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </HabitCategorySection>
          )
        })}
      </section>

      <section className="page mt-16 lg:mt-20">
        <div className="border-t-2 border-ink pt-4">
          <p className="label-accent">{copy.swaps.futureEyebrow}</p>
          <h2 className="mt-2 max-w-2xl text-[clamp(2rem,4vw,3.2rem)] leading-[0.9] text-ink">
            {copy.swaps.futureTitle}
          </h2>
          <p className="mt-3 max-w-xl text-[12px] leading-relaxed text-muted">
            {copy.swaps.futureIntro}
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <article className="border-2 border-dashed border-line bg-sky/30 p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-11 w-11 items-center justify-center bg-canvas text-accent-dark">
                <PenLine className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="border border-accent/40 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-accent-dark">
                {copy.swaps.comingSoon}
              </span>
            </div>
            <h3 className="mt-5 text-[2rem] leading-none text-ink">
              {copy.swaps.createSwapTitle}
            </h3>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">
              {copy.swaps.createSwapBody}
            </p>
          </article>

          <article className="border-2 border-dashed border-line bg-sky/30 p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-11 w-11 items-center justify-center bg-canvas text-accent-dark">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="border border-accent/40 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-accent-dark">
                {copy.swaps.comingSoon}
              </span>
            </div>
            <h3 className="mt-5 text-[2rem] leading-none text-ink">
              {copy.swaps.dreamTripTitle}
            </h3>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">
              {copy.swaps.dreamTripBody}
            </p>
          </article>
        </div>

        <p className="mt-4 text-[10px] leading-relaxed text-muted">
          {copy.swaps.futureNote}
        </p>
      </section>

      <section id="destinations" className="page mt-16 scroll-mt-28 lg:mt-20">
        <div className="border-t-2 border-ink pt-4">
          <p className="label-accent">{copy.swaps.cta}</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="max-w-2xl text-[clamp(2rem,4vw,3.2rem)] leading-[0.9] text-ink">
                {copy.swaps.destinationsTitle}
              </h2>
              <p className="mt-2 max-w-xl text-[12px] leading-relaxed text-muted">
                {copy.swaps.destinationsIntro}
              </p>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              {summary.habits.length} {copy.swaps.selected}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {DESTINATIONS.map((destination) => {
            const text = destinationText(destination)
            return (
              <Link
                key={destination.id}
                to={`/destination/${destination.id}${query}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                  <DestinationImage
                    src={destination.image}
                    alt={text.imageAlt}
                    className="transition-transform duration-[900ms] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-2 flex items-start justify-between gap-3 border-t border-line pt-2">
                  <div>
                    <h3 className="text-[1.7rem] leading-none text-ink group-hover:text-accent">
                      {destination.name}
                    </h3>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-muted">
                      {text.country} · {copy.common.nights(destination.nights)}
                    </p>
                  </div>
                  <p className="nums shrink-0 text-[11px] text-ink">
                    {fmt.eur(destination.budget, { whole: true })}
                  </p>
                </div>
                <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink group-hover:text-accent">
                  {copy.swaps.choose}
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </span>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
