import { useState } from 'react'
import type { PlanReminder, ReminderFrequency } from '../types'
import { useI18n } from '../i18n/context'
import type { ReminderValues } from '../lib/reminders'
import { cn } from '../lib/cn'

interface ReminderFormProps {
  destinationId: string
  initial?: PlanReminder
  defaultDay: number
  onSubmit: (values: ReminderValues) => void
  onCancel: () => void
  onRemove?: () => void
}

export function ReminderForm({
  destinationId,
  initial,
  defaultDay,
  onSubmit,
  onCancel,
  onRemove,
}: ReminderFormProps) {
  const { copy } = useI18n()
  const [frequency, setFrequency] = useState<ReminderFrequency>(
    initial?.frequency ?? 'monthly',
  )
  const [time, setTime] = useState(initial?.time ?? '09:00')
  const [day, setDay] = useState(
    initial?.dayOfMonth ?? Math.min(28, Math.max(1, defaultDay)),
  )

  const timeId = `reminder-time-${destinationId}`
  const dayId = `reminder-day-${destinationId}`

  return (
    <form
      className="mt-3 border border-line bg-sky/30 p-3"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({
          frequency,
          time,
          dayOfMonth: frequency === 'monthly' ? day : undefined,
        })
      }}
    >
      <fieldset>
        <legend className="label">{copy.reminder.frequency}</legend>
        <div className="mt-1 flex gap-4">
          {(['monthly', 'daily'] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={frequency === value}
              onClick={() => setFrequency(value)}
              className={cn(
                'border-b-2 pb-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors',
                frequency === value
                  ? 'border-accent text-ink'
                  : 'border-transparent text-muted hover:text-ink',
              )}
            >
              {value === 'daily' ? copy.reminder.daily : copy.reminder.monthly}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-3 flex flex-wrap gap-4">
        <label
          htmlFor={timeId}
          className="flex flex-col gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted"
        >
          {copy.reminder.time}
          <input
            id={timeId}
            type="time"
            required
            value={time}
            onChange={(event) => setTime(event.target.value)}
            className="border border-line bg-canvas px-2 py-1.5 text-[12px] text-ink"
          />
        </label>

        {frequency === 'monthly' && (
          <label
            htmlFor={dayId}
            className="flex flex-col gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted"
          >
            {copy.reminder.day}
            <select
              id={dayId}
              value={day}
              onChange={(event) => setDay(Number(event.target.value))}
              className="border border-line bg-canvas px-2 py-1.5 text-[12px] text-ink"
            >
              {Array.from({ length: 28 }, (_, index) => index + 1).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary px-3 py-2 text-[10px]">
          {initial ? copy.reminder.updateCalendar : copy.reminder.addToCalendar}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
        >
          {copy.reminder.cancel}
        </button>
        {initial && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-[9px] font-semibold uppercase tracking-[0.12em] text-accent-dark transition-colors hover:text-ink"
          >
            {copy.reminder.remove}
          </button>
        )}
      </div>

      <p className="mt-2 text-[9px] leading-relaxed text-muted">{copy.reminder.note}</p>
    </form>
  )
}
