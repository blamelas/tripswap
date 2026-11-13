import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check, ListChecks, Moon, PlaneTakeoff, Users } from 'lucide-react'
import type { Destination, GamesEstimate, Habit } from '../types'
import { HABITS, getHabit } from '../data/habits'
import { getDestination } from '../data/destinations'
import { useI18n } from '../i18n/context'
import { calculatePlan, monthlySaving, oneTimeSaving } from '../lib/calc'
import { sanitizeSelection, toggleHabit } from '../lib/conflicts'
import { getPresets } from '../lib/presets'
import type { AllocationConflict } from '../lib/allocations'
import { executeActivation, pendingActivationConflicts } from '../lib/activation'
import {
  getPlan,
  readGamesEstimate,
  readSwapSelection,
  savePlan,
  writeGamesEstimate,
} from '../lib/storage'
import { applyGamesEstimate } from '../lib/habitValues'
import { HabitSelector } from '../components/HabitSelector'
import { MobileFundingBar, RewardPanel } from '../components/RewardPanel'
import {
  ActivationDialog,
  type ActivationConflictChoice,
} from '../components/ActivationDialog'
import { PresetButtons, type PresetView } from '../components/PresetButtons'
import { ProjectionChart } from '../components/ProjectionChart'
import { UnlockReceipt } from '../components/UnlockReceipt'
import { DestinationImage } from '../components/DestinationImage'
import { PriceBlock } from '../components/PriceBlock'
import { NotFound } from './NotFound'

function DetailView({ destination }: { destination: Destination }) {
  const { copy, fmt, destinationText, habitText } = useI18n()
  const text = destinationText(destination)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialIds = useMemo(() => {
    const raw = searchParams.get('h')
    const source = raw ? raw.split(',').filter(Boolean) : readSwapSelection()
    return sanitizeSelection(source, HABITS)
    // Read the deep link / global selection once; later changes are local.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [selected, setSelected] = useState<string[]>(initialIds)
  const [gamesEstimate, setGamesEstimate] = useState<GamesEstimate | null>(() =>
    readGamesEstimate(),
  )
  const [horizon, setHorizon] = useState(12)
  const [savedPlan, setSavedPlan] = useState(() => getPlan(destination.id))
  const [justStarted, setJustStarted] = useState(false)
  const [activation, setActivation] = useState<{
    raw: AllocationConflict[]
    choices: ActivationConflictChoice[]
    remaining: number
  } | null>(null)

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
        .filter((habit): habit is Habit => habit !== undefined)
        .map((habit) => applyGamesEstimate(habit, gamesEstimate)),
    [selected, gamesEstimate],
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

  function handleGamesEstimate(estimate: GamesEstimate) {
    setGamesEstimate(estimate)
    writeGamesEstimate(estimate)
  }

  function handleSave() {
    savePlan({
      destinationId: destination.id,
      habitIds: selected,
      horizonMonths: horizon,
      savedAt: new Date().toISOString(),
      gamesEstimate: gamesEstimate ?? undefined,
    })
    setSavedPlan(getPlan(destination.id))
  }

  const planStatus = savedPlan ? (savedPlan.lifecycle?.status ?? 'saved') : 'none'
  const canStart = plan.habits.length > 0

  function toChoice(conflict: AllocationConflict): ActivationConflictChoice {
    const habit = getHabit(conflict.habitId)
    const other = getDestination(conflict.otherDestinationId)
    return {
      habitId: conflict.habitId,
      habitTitle: habit ? habitText(habit).title : conflict.habitId,
      kind: conflict.kind,
      otherDestinationName: other ? other.name : '',
    }
  }

  function handleStart() {
    // Starting always persists the current selection first, so the saved plan
    // and its new allocations can never drift apart.
    handleSave()

    const startingHabits = selectedHabits.filter(
      (habit) => monthlySaving(habit) > 0 || oneTimeSaving(habit) > 0,
    )
    const conflicts = pendingActivationConflicts(startingHabits, destination.id)
    if (conflicts.length === 0) {
      executeActivation(
        destination.id,
        startingHabits,
        [],
        [],
        new Date().toISOString(),
      )
      setSavedPlan(getPlan(destination.id))
      setJustStarted(true)
      return
    }

    setActivation({
      raw: conflicts,
      choices: conflicts.map(toChoice),
      remaining: startingHabits.length - conflicts.length,
    })
  }

  function handleConfirmActivation(decisions: Parameters<typeof executeActivation>[3]) {
    if (!activation) return
    executeActivation(
      destination.id,
      selectedHabits,
      activation.raw,
      decisions,
      new Date().toISOString(),
    )
    setActivation(null)
    setSavedPlan(getPlan(destination.id))
    setJustStarted(true)
  }

  function handleViewProgress() {
    navigate('/unlocks#active')
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

      {justStarted && (
        <div className="page pt-6" role="status" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-4 border border-accent bg-accent/10 px-4 py-3">
            <div className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-dark" strokeWidth={3} aria-hidden="true" />
              <div>
                <p className="text-[12px] font-semibold text-ink">{copy.plan.startSuccess}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                  {copy.plan.startSuccessBody}
                </p>
              </div>
            </div>
            <Link
              to="/unlocks#active"
              className="inline-flex items-center gap-1.5 border-b border-ink pb-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {copy.plan.startSuccessLink}
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}

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
              planStatus={planStatus}
              canStart={canStart}
              onSave={handleSave}
              onStart={handleStart}
              onViewProgress={handleViewProgress}
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
                gamesEstimate={gamesEstimate}
                onGamesEstimateChange={handleGamesEstimate}
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
              planStatus={planStatus}
              canStart={canStart}
              onSave={handleSave}
              onStart={handleStart}
              onViewProgress={handleViewProgress}
            />
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
              {copy.detail.step3}
            </p>
          </div>
        </aside>
      </div>

      <MobileFundingBar
        plan={plan}
        planStatus={planStatus}
        canStart={canStart}
        onSave={handleSave}
        onStart={handleStart}
        onViewProgress={handleViewProgress}
      />

      {activation && (
        <ActivationDialog
          destinationName={destination.name}
          conflicts={activation.choices}
          remainingCount={activation.remaining}
          onConfirm={handleConfirmActivation}
          onCancel={() => setActivation(null)}
        />
      )}
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
