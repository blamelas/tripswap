import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ListChecks, Moon, PlaneTakeoff, Users } from 'lucide-react'
import type { Destination, Habit } from '../types'
import { HABITS, getHabit } from '../data/habits'
import { getDestination } from '../data/destinations'
import { useI18n } from '../i18n/context'
import { calculatePlan } from '../lib/calc'
import { sanitizeSelection, toggleHabit } from '../lib/conflicts'
import { getPresets } from '../lib/presets'
import {
  getPlan,
  readSwapSelection,
  savePlan,
} from '../lib/storage'
import { HabitSelector } from '../components/HabitSelector'
import { MobileFundingBar, RewardPanel } from '../components/RewardPanel'
import { PresetButtons, type PresetView } from '../components/PresetButtons'
import { ProjectionChart } from '../components/ProjectionChart'
import { UnlockReceipt } from '../components/UnlockReceipt'
import { DestinationImage } from '../components/DestinationImage'
import { PriceBlock } from '../components/PriceBlock'
import { NotFound } from './NotFound'

function DetailView({ destination }: { destination: Destination }) {
  const { copy, fmt, destinationText } = useI18n()
  const text = destinationText(destination)
  const [searchParams, setSearchParams] = useSearchParams()

  const initialIds = useMemo(() => {
    const raw = searchParams.get('h')
    const source = raw ? raw.split(',').filter(Boolean) : readSwapSelection()
    return sanitizeSelection(source, HABITS)
    // Read the deep link / global selection once; later changes are local.
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
    { label: copy.detail.labels.departure, value: destination.departureCity, icon: PlaneTakeoff },
    { label: copy.detail.labels.travellers, value: String(destination.travelers), icon: Users },
    { label: copy.detail.labels.nights, value: String(destination.nights), icon: Moon },
    { label: copy.detail.labels.includes, value: text.includes.join(' · '), icon: ListChecks },
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
            {meta.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="border-b border-line py-3 sm:border-b-0 sm:border-r sm:pr-4 sm:last:border-r-0"
                >
                  <dt className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
                    <Icon className="h-3 w-3 shrink-0 text-accent-dark" aria-hidden="true" />
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-[12px] text-ink">{item.value}</dd>
                </div>
              )
            })}
          </dl>

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

          <div className="mt-12">
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

            <div className="mt-5 bg-sky p-4 lg:p-5">
              <PresetButtons
                presets={presets}
                activeIds={selected}
                onApply={(habitIds) => setSelected(habitIds)}
              />
            </div>

            <div className="mt-8">
              <HabitSelector
                selectedIds={selected}
                onToggle={handleToggle}
              />
            </div>
          </div>

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
