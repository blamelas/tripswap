import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BookmarkCheck, BookmarkPlus, Check } from 'lucide-react'
import type { Destination, Habit } from '../types'
import { HABITS, getHabit } from '../data/habits'
import { getDestination } from '../data/destinations'
import { useI18n } from '../i18n/context'
import { calculatePlan } from '../lib/calc'
import { sanitizeSelection, toggleHabit } from '../lib/conflicts'
import { getPresets } from '../lib/presets'
import { getPlan, savePlan } from '../lib/storage'
import { HabitSelector } from '../components/HabitSelector'
import { MobileFundingBar, RewardPanel } from '../components/RewardPanel'
import { PresetButtons, type PresetView } from '../components/PresetButtons'
import { ProjectionChart } from '../components/ProjectionChart'
import { UnlockReceipt } from '../components/UnlockReceipt'
import { DestinationImage } from '../components/DestinationImage'
import { PriceBlock } from '../components/PriceBlock'
import { NotFound } from './NotFound'

function UnlockMoment({
  destination,
  months,
  swaps,
  saved,
  onSave,
}: {
  destination: Destination
  months: number
  swaps: number
  saved: boolean
  onSave: () => void
}) {
  const { copy, fmt } = useI18n()

  return (
    <section className="mt-8 bg-accent p-6 text-ink lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink/70">
            {copy.reward.reachedEyebrow}
          </p>
          <p className="mt-2 max-w-lg font-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.8]">
            {copy.reward.reachedTitle}
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink">
          <Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 border-t border-ink/20 pt-4">
        <span className="nums text-[2rem] leading-none">{months}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/70">
          {months === 1 ? copy.reward.month : copy.reward.months}
        </span>
        <span className="text-[11px] font-medium">
          {swaps} {copy.reward.selected} · {fmt.eur(destination.budget)}
        </span>
      </div>

      <p className="mt-2 max-w-xl text-[10px] leading-relaxed text-ink/70">
        {copy.reward.covered}
      </p>
      <p className="mt-1 text-[10px] text-ink/60">{copy.reward.simulation}</p>

      <button type="button" onClick={onSave} className="btn-primary mt-5">
        {saved ? (
          <BookmarkCheck className="h-4 w-4" aria-hidden="true" />
        ) : (
          <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
        )}
        {saved ? copy.detail.unlockSaved : copy.detail.unlockSave}
      </button>
    </section>
  )
}

function DetailView({ destination }: { destination: Destination }) {
  const { copy, fmt, destinationText } = useI18n()
  const text = destinationText(destination)
  const [searchParams, setSearchParams] = useSearchParams()

  const initialIds = useMemo(() => {
    const raw = searchParams.get('h')
    if (!raw) return []
    return sanitizeSelection(raw.split(',').filter(Boolean), HABITS)
    // Read the deep link once; later changes are owned by local state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [selected, setSelected] = useState<string[]>(initialIds)
  const [horizon, setHorizon] = useState(12)
  const [saved, setSaved] = useState(() => Boolean(getPlan(destination.id)))

  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    if (selected.length > 0) next.set('h', selected.join(','))
    else next.delete('h')

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true })
    }
  }, [selected, searchParams, setSearchParams])

  const selectedHabits = useMemo(
    () =>
      selected
        .map((id) => getHabit(id))
        .filter((habit): habit is Habit => habit !== undefined),
    [selected],
  )

  const plan = useMemo(
    () => calculatePlan(destination.budget, selectedHabits, horizon),
    [destination.budget, selectedHabits, horizon],
  )

  const presets: PresetView[] = useMemo(
    () =>
      getPresets(destination).map((preset) => {
        const habits = preset.habitIds
          .map((id) => getHabit(id))
          .filter((habit): habit is Habit => habit !== undefined)
        return {
          id: preset.id,
          habitIds: preset.habitIds,
          months: calculatePlan(destination.budget, habits, horizon).monthsToTarget,
        }
      }),
    [destination, horizon],
  )

  function handleToggle(habit: Habit) {
    setSelected((previous) => toggleHabit(previous, habit, HABITS))
  }

  function handleSave() {
    savePlan({
      destinationId: destination.id,
      habitIds: selected,
      horizonMonths: horizon,
      savedAt: new Date().toISOString(),
    })
    setSaved(true)
  }

  const meta = [
    { label: copy.detail.labels.departure, value: destination.departureCity },
    { label: copy.detail.labels.travellers, value: String(destination.travelers) },
    { label: copy.detail.labels.nights, value: String(destination.nights) },
    { label: copy.detail.labels.includes, value: text.includes.join(' · ') },
  ]

  return (
    <article className="pb-28 lg:pb-0">
      <section>
        <div className="relative h-[42vh] min-h-[300px] overflow-hidden bg-ink lg:h-[58vh] lg:max-h-[560px]">
          <DestinationImage src={destination.image} alt={text.imageAlt} priority />
          <Link
            to="/"
            className="absolute left-4 top-4 inline-flex items-center gap-2 bg-canvas px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-3 w-3" />
            {copy.detail.back}
          </Link>
          <span className="absolute right-0 top-0 bg-canvas px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
            {copy.destinationCategories[destination.category]}
          </span>
        </div>

        <div className="bg-ink text-canvas">
          <div className="page grid gap-6 py-6 lg:grid-cols-[1fr_auto] lg:items-end lg:py-8">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-canvas/60">
                {text.country} · {copy.common.nights(destination.nights)}
              </p>
              <h1 className="mt-2 text-[clamp(2.8rem,7vw,6rem)] leading-[0.8] tracking-tightest text-canvas">
                {destination.name}
              </h1>
              <p className="mt-3 max-w-xl font-display text-[clamp(1.2rem,2.3vw,1.7rem)] normal-case leading-[1.05] text-accent">
                {text.quote}
              </p>
            </div>
            <PriceBlock
              budget={destination.budget}
              size="md"
              tone="dark"
              className="shrink-0 lg:pb-1"
            />
          </div>
        </div>
      </section>

      <div className="page grid gap-10 pt-8 lg:grid-cols-12 lg:gap-12 lg:pt-12">
        <div className="min-w-0 lg:col-span-7">
          <p className="max-w-2xl text-[14.5px] leading-relaxed text-ink-soft">
            {text.description}
          </p>

          <dl className="mt-7 grid grid-cols-2 border-t border-line sm:grid-cols-4">
            {meta.map((item) => (
              <div
                key={item.label}
                className="border-b border-line py-3 sm:border-b-0 sm:border-r sm:pr-4 sm:last:border-r-0"
              >
                <dt className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
                  {item.label}
                </dt>
                <dd className="mt-1 text-[12px] text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-3 max-w-2xl text-[10px] leading-relaxed text-muted">
            {copy.detail.illustrative}
          </p>

          <div className="mt-8 lg:hidden">
            <RewardPanel
              destination={destination}
              plan={plan}
              horizon={horizon}
              onHorizon={setHorizon}
              saved={saved}
              onSave={handleSave}
            />
          </div>

          <div className="mt-10">
            <PresetButtons
              presets={presets}
              activeIds={selected}
              onApply={(habitIds) => setSelected(habitIds)}
            />
          </div>

          <div className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="label-accent">{copy.detail.step2Eyebrow}</p>
                <h2 className="mt-1.5 text-[clamp(2rem,4vw,3rem)] leading-none text-ink">
                  {copy.detail.step2Title}
                </h2>
              </div>
              <p className="max-w-[240px] text-[11px] leading-relaxed text-muted">
                {copy.detail.step2Intro}
              </p>
            </div>

            <div className="mt-6">
              <HabitSelector selectedIds={selected} onToggle={handleToggle} />
            </div>
          </div>

          {plan.monthsToTarget !== null && (
            <div className="mt-10">
              <div className="flex items-end justify-between border-b border-line pb-2">
                <p className="label-accent">{copy.detail.projectionEyebrow}</p>
                <span className="nums text-[10px] uppercase tracking-[0.12em] text-muted">
                  {fmt.months(plan.horizonMonths)}
                </span>
              </div>
              <div className="mt-4">
                <ProjectionChart
                  monthly={plan.monthly}
                  oneTime={plan.oneTime}
                  target={plan.target}
                  horizonMonths={horizon}
                  monthsToTarget={plan.monthsToTarget}
                  unlocked={plan.unlocked}
                />
              </div>
            </div>
          )}

          {plan.unlocked && plan.monthsToTarget !== null && (
            <UnlockMoment
              destination={destination}
              months={plan.monthsToTarget}
              swaps={plan.habits.length}
              saved={saved}
              onSave={handleSave}
            />
          )}

          <div className="mt-10">
            <UnlockReceipt plan={plan} />
          </div>
        </div>

        <aside className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-20">
            <RewardPanel
              destination={destination}
              plan={plan}
              horizon={horizon}
              onHorizon={setHorizon}
              saved={saved}
              onSave={handleSave}
            />
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
              {copy.detail.step3}
            </p>
          </div>
        </aside>
      </div>

      <MobileFundingBar plan={plan} saved={saved} onSave={handleSave} />
    </article>
  )
}

export function DestinationDetail() {
  const { copy } = useI18n()
  const { id } = useParams()
  const destination = id ? getDestination(id) : undefined

  if (!destination) {
    return <NotFound title={copy.detail.missingTitle} body={copy.detail.missingBody} />
  }

  return <DetailView destination={destination} />
}
