import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Bell, CalendarPlus } from 'lucide-react'
import type { Destination, PlanReminder, SavedPlan } from '../types'
import { getDestination } from '../data/destinations'
import { getHabit } from '../data/habits'
import { useI18n } from '../i18n/context'
import { calculatePlan, type PlanResult } from '../lib/calc'
import { clearPlans, readPlans, removePlan } from '../lib/storage'
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
import { DestinationImage } from '../components/DestinationImage'

interface PlanView {
  saved: SavedPlan
  destination: Destination
  plan: PlanResult
}

function buildViews(plans: SavedPlan[]): PlanView[] {
  return plans.flatMap((saved) => {
    const destination = getDestination(saved.destinationId)
    if (!destination) return []
    const habits = saved.habitIds
      .map((id) => getHabit(id))
      .filter((habit) => habit !== undefined)
    return [
      {
        saved,
        destination,
        plan: calculatePlan(destination.budget, habits, saved.horizonMonths),
      },
    ]
  })
}

export function MyUnlocks() {
  const { copy, fmt, destinationText } = useI18n()
  const [plans, setPlans] = useState<SavedPlan[]>(() => readPlans())
  const [reminders, setReminders] = useState<PlanReminder[]>(() => readReminders())
  const [openReminder, setOpenReminder] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ destinationId: string; text: string } | null>(
    null,
  )
  const views = buildViews(plans)

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
              <ArrowUpRight className="h-3.5 w-3.5" />
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
          {views.map((view, index) => {
            const text = destinationText(view.destination)
            const reminder = reminders.find(
              (item) => item.destinationId === view.saved.destinationId,
            )
            const href = `/destination/${view.saved.destinationId}${
              view.saved.habitIds.length ? `?h=${view.saved.habitIds.join(',')}` : ''
            }`

            return (
              <article
                key={view.saved.destinationId}
                className="grid gap-6 border-b border-line py-8 lg:grid-cols-12 lg:gap-10"
              >
                <Link
                  to={href}
                  className="relative block aspect-[16/10] overflow-hidden bg-ink lg:col-span-5"
                  aria-label={view.destination.name}
                >
                  <DestinationImage
                    src={view.destination.image}
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
                      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
                        {text.country} · {copy.unlocks.savedOn(fmt.date(view.saved.savedAt))}
                      </p>
                      <h2 className="mt-1.5 text-[clamp(2rem,4vw,3.2rem)] leading-[0.86] text-ink">
                        {view.destination.name}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="label">{copy.unlocks.estimatedHorizon}</p>
                      <p className="nums mt-1 text-[2.2rem] leading-none text-accent">
                        {fmt.months(view.plan.monthsToTarget)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-2 max-w-lg text-[12px] leading-relaxed text-muted">
                    {text.quote}
                  </p>

                  <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-line pt-4">
                    <div>
                      <dt className="label">{copy.unlocks.target}</dt>
                      <dd className="nums mt-1 text-[14px] text-ink">
                        {fmt.eur(view.destination.budget)}
                      </dd>
                    </div>
                    <div>
                      <dt className="label">{copy.unlocks.perMonth}</dt>
                      <dd className="nums mt-1 text-[14px] text-ink">
                        {fmt.eur(view.plan.monthly)}
                      </dd>
                    </div>
                    <div>
                      <dt className="label">{copy.unlocks.swaps}</dt>
                      <dd className="nums mt-1 text-[14px] text-ink">
                        {view.saved.habitIds.length}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 h-[2px] w-full bg-line">
                    <div
                      className="h-full bg-accent transition-[width] duration-700"
                      style={{ width: `${Math.round(view.plan.progress * 100)}%` }}
                    />
                  </div>

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
                      onClick={() => handleRemove(view.saved.destinationId)}
                      className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
                    >
                      {copy.unlocks.remove}
                    </button>
                  </div>

                  <div className="mt-4 border-t border-line pt-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        aria-expanded={openReminder === view.saved.destinationId}
                        aria-controls={`reminder-${view.saved.destinationId}`}
                        onClick={() =>
                          setOpenReminder((current) =>
                            current === view.saved.destinationId
                              ? null
                              : view.saved.destinationId,
                          )
                        }
                        className="inline-flex items-center gap-1.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:text-accent"
                      >
                        {reminder ? (
                          <Bell className="h-3.5 w-3.5" />
                        ) : (
                          <CalendarPlus className="h-3.5 w-3.5" />
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

                    {notice?.destinationId === view.saved.destinationId && (
                      <p className="mt-1.5 text-[10px] leading-relaxed text-moss">
                        {notice.text}
                      </p>
                    )}

                    <div id={`reminder-${view.saved.destinationId}`}>
                      {openReminder === view.saved.destinationId && (
                        <ReminderForm
                          destinationId={view.saved.destinationId}
                          initial={reminder}
                          defaultDay={Math.min(
                            28,
                            Math.max(1, new Date(view.saved.savedAt).getDate() || 1),
                          )}
                          onSubmit={(values) => handleReminderSubmit(view, values)}
                          onCancel={() => setOpenReminder(null)}
                          onRemove={
                            reminder
                              ? () => handleReminderRemove(view.saved.destinationId)
                              : undefined
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
