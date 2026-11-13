import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, Bell, CalendarPlus } from 'lucide-react'
import type {
  Destination,
  Habit,
  LifecycleStatus,
  PlanReminder,
  SavedPlan,
} from '../types'
import { getDestination } from '../data/destinations'
import { HABITS, getHabit } from '../data/habits'
import { useI18n } from '../i18n/context'
import {
  calculatePlan,
  combinedTotals,
  monthlySaving,
  oneTimeSaving,
  planProgress,
  type LifecycleProgress,
  type PlanResult,
} from '../lib/calc'
import {
  achievePlan,
  addAllocation,
  clearPlans,
  getCreditedHabitIds,
  getReservedAllocations,
  pausePlan,
  readGamesEstimate,
  readPlans,
  removeAllocation,
  removePlan,
  resumePlan,
} from '../lib/storage'
import { findActivationConflicts, type AllocationConflict } from '../lib/allocations'
import { executeActivation } from '../lib/activation'
import { applyGamesEstimate } from '../lib/habitValues'
import {
  buildReminderIcs,
  clearReminders,
  createReminderUid,
  downloadIcs,
  readReminders,
  removeReminder,
  saveReminder,
  type ReminderValues,
} from '../lib/reminders'
import { ReminderForm } from '../components/ReminderForm'
import { ActivationDialog, type ActivationConflictChoice } from '../components/ActivationDialog'
import { ActivePlanCard, type AllocatedHabitLine, type CreditedHabitLine } from '../components/ActivePlanCard'
import { SavedPlanCard } from '../components/SavedPlanCard'
import { AchievedPlanCard } from '../components/AchievedPlanCard'
import { ProgressBar } from '../components/ProgressBar'

function isoNow(): string {
  return new Date().toISOString()
}

interface PlanView {
  saved: SavedPlan
  destination: Destination
  plan: PlanResult
  status: LifecycleStatus
  progress: LifecycleProgress | null
}

function buildViews(plans: SavedPlan[], nowIso: string): PlanView[] {
  const globalGamesEstimate = readGamesEstimate()

  return plans.flatMap((saved) => {
    const destination = getDestination(saved.destinationId)
    if (!destination) return []
    const gamesEstimate = saved.gamesEstimate ?? globalGamesEstimate
    const habits = saved.habitIds
      .map((id) => getHabit(id))
      .filter((habit) => habit !== undefined)
      .map((habit) => applyGamesEstimate(habit, gamesEstimate))
    const status: LifecycleStatus = saved.lifecycle?.status ?? 'saved'
    const lifecycle = saved.lifecycle
    const progress =
      lifecycle && status !== 'saved'
        ? planProgress(
            destination.budget,
            lifecycle.allocations,
            lifecycle.periods,
            lifecycle.oneTimeCredits,
            lifecycle.confirmed,
            nowIso,
          )
        : null

    return [
      {
        saved,
        destination,
        plan: calculatePlan(destination.budget, habits, saved.horizonMonths),
        status,
        progress,
      },
    ]
  })
}

export function MyUnlocks() {
  const { copy, fmt, habitText } = useI18n()
  const location = useLocation()
  const [plans, setPlans] = useState<SavedPlan[]>(() => readPlans())
  const [reminders, setReminders] = useState<PlanReminder[]>(() => readReminders())
  const [openReminder, setOpenReminder] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ destinationId: string; text: string } | null>(
    null,
  )
  const [pending, setPending] = useState<{
    destinationId: string
    habits: Habit[]
    raw: AllocationConflict[]
    choices: ActivationConflictChoice[]
    remaining: number
  } | null>(null)

  const [nowIso] = useState(() => new Date().toISOString())
  const views = buildViews(plans, nowIso)
  const activeViews = views.filter(
    (view) => view.status === 'active' || view.status === 'paused',
  )
  const savedViews = views.filter((view) => view.status === 'saved')
  const achievedViews = views.filter((view) => view.status === 'achieved')
  const activeOnly = activeViews.filter((view) => view.status === 'active')
  const aggregate = combinedTotals(
    activeOnly.map((view) => ({
      target: view.destination.budget,
      accumulated: view.progress?.accumulated ?? 0,
    })),
  )

  const reserved = getReservedAllocations()
  const creditedIds = getCreditedHabitIds()

  useEffect(() => {
    if (location.hash !== '#active') return
    const target = document.getElementById('active')
    if (!target) return
    const frame = window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [location.hash])

  function notify(destinationId: string, text: string) {
    setNotice({ destinationId, text })
    window.setTimeout(() => {
      setNotice((current) =>
        current?.destinationId === destinationId ? null : current,
      )
    }, 7000)
  }

  function handleRemove(destinationId: string) {
    setPlans(removePlan(destinationId))
    setReminders(removeReminder(destinationId))
    if (openReminder === destinationId) setOpenReminder(null)
  }

  function handleClear() {
    if (!window.confirm(copy.unlocks.confirm)) return
    clearPlans()
    clearReminders()
    setPlans([])
    setReminders([])
    setOpenReminder(null)
  }

  function handleReminderSubmit(view: PlanView, values: ReminderValues) {
    const destinationId = view.saved.destinationId
    const reminder: PlanReminder = {
      destinationId,
      ...values,
      createdAt: new Date().toISOString(),
    }
    setReminders(saveReminder(reminder))

    const query = view.saved.habitIds.length
      ? `?h=${view.saved.habitIds.join(',')}`
      : ''
    const url = `${window.location.origin}/destination/${destinationId}${query}`
    const ics = buildReminderIcs({
      uid: createReminderUid(destinationId),
      summary: copy.reminder.eventTitle(view.destination.name),
      description: copy.reminder.eventDescription(
        view.plan.habits.length,
        fmt.eur(view.plan.monthly),
        fmt.months(view.plan.monthsToTarget),
        fmt.eur(view.destination.budget),
      ),
      url,
      reminder,
      now: new Date(),
    })

    downloadIcs(`tripswap-${destinationId}.ics`, ics)
    setOpenReminder(null)
    notify(destinationId, copy.reminder.saved)
  }

  function handleReminderRemove(destinationId: string) {
    setReminders(removeReminder(destinationId))
    setOpenReminder(null)
    notify(destinationId, copy.reminder.removed)
  }

  function habitsFor(view: PlanView) {
    const gamesEstimate = view.saved.gamesEstimate ?? readGamesEstimate()
    return view.saved.habitIds
      .map((id) => getHabit(id))
      .filter((habit) => habit !== undefined)
      .map((habit) => applyGamesEstimate(habit, gamesEstimate))
  }

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

  function handleStartFromCard(view: PlanView) {
    const habits = habitsFor(view)
    const conflicts = findActivationConflicts(
      habits.filter(
        (habit) => monthlySaving(habit) > 0 || oneTimeSaving(habit) > 0,
      ).map((habit) => habit.id),
      view.destination.id,
      reserved,
      creditedIds,
      HABITS,
    )

    if (conflicts.length === 0) {
      executeActivation(view.destination.id, habits, [], [], isoNow())
      setPlans(readPlans())
      return
    }

    setPending({
      destinationId: view.destination.id,
      habits,
      raw: conflicts,
      choices: conflicts.map(toChoice),
      remaining:
        habits.filter(
          (habit) => monthlySaving(habit) > 0 || oneTimeSaving(habit) > 0,
        ).length - conflicts.length,
    })
  }

  function handleConfirmActivation(
    decisions: Parameters<typeof executeActivation>[3],
  ) {
    if (!pending) return
    executeActivation(
      pending.destinationId,
      pending.habits,
      pending.raw,
      decisions,
      isoNow(),
    )
    setPending(null)
    setPlans(readPlans())
  }

  function allocatedLines(view: PlanView): AllocatedHabitLine[] {
    return (view.saved.lifecycle?.allocations ?? []).map((allocation) => {
      const habit = getHabit(allocation.habitId)
      return {
        habitId: allocation.habitId,
        title: habit ? habitText(habit).title : allocation.habitId,
        monthly: allocation.monthly,
      }
    })
  }

  function creditedLines(view: PlanView): CreditedHabitLine[] {
    return (view.saved.lifecycle?.oneTimeCredits ?? []).map((credit) => {
      const habit = getHabit(credit.habitId)
      return {
        habitId: credit.habitId,
        title: habit ? habitText(habit).title : credit.habitId,
        amount: credit.amount,
      }
    })
  }

  function availableFor(view: PlanView) {
    const allocated = new Set(
      (view.saved.lifecycle?.allocations ?? []).map((item) => item.habitId),
    )
    const credited = new Set(
      (view.saved.lifecycle?.oneTimeCredits ?? []).map((item) => item.habitId),
    )
    const groupsInPlan = new Set(
      (view.saved.lifecycle?.allocations ?? [])
        .map((allocation) => getHabit(allocation.habitId)?.exclusiveGroup)
        .filter((group): group is string => group !== undefined),
    )
    const gamesEstimate = view.saved.gamesEstimate ?? readGamesEstimate()

    return HABITS.flatMap((habit) => {
      if (allocated.has(habit.id) || credited.has(habit.id)) return []
      if (habit.exclusiveGroup && groupsInPlan.has(habit.exclusiveGroup)) return []
      const effective = applyGamesEstimate(habit, gamesEstimate)
      const saving = monthlySaving(effective) || oneTimeSaving(effective)
      if (saving <= 0) return []
      const conflicts = findActivationConflicts(
        [habit.id],
        view.destination.id,
        reserved,
        creditedIds,
        HABITS,
      )
      if (conflicts.length > 0) return []
      return [
        {
          habitId: habit.id,
          title: habitText(habit).title,
          saving,
          kind: habit.kind,
        },
      ]
    })
  }

  function renderReminder(view: PlanView) {
    const destinationId = view.saved.destinationId
    const reminder = reminders.find((item) => item.destinationId === destinationId)

    return (
      <div className="pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-expanded={openReminder === destinationId}
            aria-controls={`reminder-${destinationId}`}
            onClick={() =>
              setOpenReminder((current) =>
                current === destinationId ? null : destinationId,
              )
            }
            className="inline-flex items-center gap-1.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:text-accent"
          >
            {reminder ? (
              <Bell className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {reminder ? copy.reminder.edit : copy.reminder.add}
          </button>

          {reminder && (
            <span className="text-[10px] text-muted">
              {reminder.frequency === 'daily'
                ? copy.reminder.summaryDaily(reminder.time)
                : copy.reminder.summaryMonthly(
                    reminder.dayOfMonth ?? 1,
                    reminder.time,
                  )}
            </span>
          )}
        </div>

        {notice?.destinationId === destinationId && (
          <p className="mt-1.5 text-[10px] leading-relaxed text-moss">{notice.text}</p>
        )}

        <div id={`reminder-${destinationId}`}>
          {openReminder === destinationId && (
            <ReminderForm
              destinationId={destinationId}
              initial={reminder}
              defaultDay={Math.min(
                28,
                Math.max(1, new Date(view.saved.savedAt).getDate() || 1),
              )}
              onSubmit={(values) => handleReminderSubmit(view, values)}
              onCancel={() => setOpenReminder(null)}
              onRemove={
                reminder ? () => handleReminderRemove(destinationId) : undefined
              }
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="page py-10 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-ink pb-5">
        <div>
          <p className="label-accent">{copy.unlocks.eyebrow}</p>
          <h1 className="mt-2 text-[clamp(2.8rem,7vw,5.4rem)] leading-[0.8] tracking-tightest text-ink">
            {copy.unlocks.title}
          </h1>
        </div>
        {views.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent"
          >
            {copy.unlocks.clear}
          </button>
        )}
      </div>

      <p className="mt-4 max-w-xl text-[12px] leading-relaxed text-muted">
        {copy.unlocks.intro}
      </p>

      {views.length === 0 ? (
        <div className="mt-12 grid gap-8 bg-sky p-6 sm:p-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="label-accent">{copy.unlocks.emptyEyebrow}</p>
            <h2 className="mt-3 text-[clamp(2.4rem,5.5vw,4.4rem)] leading-[0.82] text-ink">
              {copy.unlocks.emptyTitle}
            </h2>
            <p className="mt-4 max-w-md text-[13px] leading-relaxed text-ink/65">
              {copy.unlocks.emptyBody}
            </p>
            <Link to="/" className="btn-primary mt-6">
              {copy.unlocks.emptyCta}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="hidden lg:block">
            <p className="font-display text-[clamp(6rem,14vw,12rem)] font-semibold leading-[0.65] text-ink/20">
              €0*
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          {activeViews.length > 0 && (
            <section id="active" className="scroll-mt-24 pt-6">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-3">
                <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] leading-none text-ink">
                  {copy.unlocks.sections.active}
                </h2>
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
                  {copy.plan.estimated}
                </span>
              </div>

              {activeOnly.length > 0 && (
              <div className="mt-5 border border-line bg-sky/40 p-4 sm:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="label">{copy.unlocks.aggregate.activePlans(aggregate.activeCount)}</p>
                  <p className="nums text-[1.6rem] leading-none text-accent">
                    {fmt.percent(aggregate.progress)}
                  </p>
                </div>
                <div className="mt-3">
                  <ProgressBar
                    value={aggregate.progress}
                    label={copy.a11y.progress}
                  />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                    <dt className="label">{copy.unlocks.aggregate.estimatedAccumulated}</dt>
                    <dd className="nums mt-1 text-[14px] text-ink">
                      {fmt.eur(aggregate.accumulated)}
                    </dd>
                  </div>
                  <div>
                    <dt className="label">{copy.unlocks.aggregate.combinedTarget}</dt>
                    <dd className="nums mt-1 text-[14px] text-ink">
                      {fmt.eur(aggregate.target)}
                    </dd>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="label">{copy.unlocks.aggregate.combinedProgress}</dt>
                    <dd className="nums mt-1 text-[14px] text-ink">
                      {fmt.percent(aggregate.progress)}
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 text-[10px] leading-relaxed text-muted">
                  {copy.unlocks.aggregate.note}
                </p>
              </div>
              )}

              <div className="mt-2">
                {activeViews.map((view, index) => (
                  <div key={view.saved.destinationId}>
                    <ActivePlanCard
                      destination={view.destination}
                      plan={view.saved}
                      progress={view.progress as LifecycleProgress}
                      index={index}
                      allocated={allocatedLines(view)}
                      credited={creditedLines(view)}
                      available={availableFor(view)}
                      onPause={() => setPlans(pausePlan(view.saved.destinationId, new Date().toISOString()))}
                      onResume={() => setPlans(resumePlan(view.saved.destinationId, new Date().toISOString()))}
                      onAchieve={() => {
                        if (!window.confirm(copy.plan.achieveConfirm)) return
                        setPlans(achievePlan(view.saved.destinationId, new Date().toISOString()))
                      }}
                      onRemove={() => handleRemove(view.saved.destinationId)}
                      onAddActivity={(habitId) => {
                        const habit = getHabit(habitId)
                        if (!habit) return
                        const gamesEstimate =
                          view.saved.gamesEstimate ?? readGamesEstimate()
                        setPlans(
                          addAllocation(
                            view.saved.destinationId,
                            applyGamesEstimate(habit, gamesEstimate),
                            new Date().toISOString(),
                          ),
                        )
                      }}
                      onRemoveAllocation={(habitId) =>
                        setPlans(
                          removeAllocation(
                            view.saved.destinationId,
                            habitId,
                            new Date().toISOString(),
                          ),
                        )
                      }
                    />
                    {renderReminder(view)}
                  </div>
                ))}
              </div>
            </section>
          )}

          {savedViews.length > 0 && (
            <section id="saved" className="scroll-mt-24 pt-10">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-3">
                <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] leading-none text-ink">
                  {copy.unlocks.sections.saved}
                </h2>
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
                  {copy.unlocks.estimatedHorizon}
                </span>
              </div>
              <div className="mt-2">
                {savedViews.map((view, index) => (
                  <div key={view.saved.destinationId}>
                    <SavedPlanCard
                      saved={view.saved}
                      destination={view.destination}
                      plan={view.plan}
                      index={index}
                      canStart={view.plan.habits.length > 0}
                      onStartNow={() => handleStartFromCard(view)}
                      onRemove={() => handleRemove(view.saved.destinationId)}
                    />
                    {renderReminder(view)}
                  </div>
                ))}
              </div>
            </section>
          )}

          {achievedViews.length > 0 && (
            <section id="achieved" className="scroll-mt-24 pt-10">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-3">
                <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] leading-none text-ink">
                  {copy.unlocks.sections.achieved}
                </h2>
              </div>
              <div className="mt-2">
                {achievedViews.map((view, index) => (
                  <AchievedPlanCard
                    key={view.saved.destinationId}
                    saved={view.saved}
                    destination={view.destination}
                    index={index}
                    onRemove={() => handleRemove(view.saved.destinationId)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {pending && (
        <ActivationDialog
          destinationName={
            getDestination(pending.destinationId)?.name ?? pending.destinationId
          }
          conflicts={pending.choices}
          remainingCount={pending.remaining}
          onConfirm={handleConfirmActivation}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  )
}
