import type { PlanReminder, ReminderFrequency } from '../types'

const KEY = 'tripswap:reminders:v1'

export interface ReminderValues {
  frequency: ReminderFrequency
  time: string
  dayOfMonth?: number
}

function isTime(value: unknown): value is string {
  return typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)
}

function isReminder(value: unknown): value is PlanReminder {
  if (!value || typeof value !== 'object') return false
  const reminder = value as Partial<PlanReminder>
  return (
    typeof reminder.destinationId === 'string' &&
    (reminder.frequency === 'daily' || reminder.frequency === 'monthly') &&
    isTime(reminder.time) &&
    (reminder.frequency === 'daily' ||
      (typeof reminder.dayOfMonth === 'number' &&
        reminder.dayOfMonth >= 1 &&
        reminder.dayOfMonth <= 28)) &&
    typeof reminder.createdAt === 'string'
  )
}

export function readReminders(): PlanReminder[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isReminder)
  } catch {
    return []
  }
}

function writeReminders(reminders: PlanReminder[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(reminders))
  } catch {
    // Storage can be unavailable; the UI still works for this session.
  }
}

export function saveReminder(reminder: PlanReminder): PlanReminder[] {
  const next = [
    reminder,
    ...readReminders().filter((item) => item.destinationId !== reminder.destinationId),
  ]
  writeReminders(next)
  return next
}

export function removeReminder(destinationId: string): PlanReminder[] {
  const next = readReminders().filter((item) => item.destinationId !== destinationId)
  writeReminders(next)
  return next
}

export function clearReminders(): void {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    // Ignore.
  }
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function toIcsLocal(date: Date): string {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(
    date.getHours(),
  )}${pad(date.getMinutes())}00`
}

export function toIcsStamp(date: Date): string {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(
    date.getUTCDate(),
  )}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(
    date.getUTCSeconds(),
  )}Z`
}

export function nextOccurrence(
  reminder: Pick<PlanReminder, 'frequency' | 'time' | 'dayOfMonth'>,
  now: Date,
): Date {
  const [hours, minutes] = reminder.time.split(':').map(Number)
  const h = Number.isFinite(hours) ? hours : 9
  const m = Number.isFinite(minutes) ? minutes : 0

  if (reminder.frequency === 'daily') {
    const candidate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      h,
      m,
      0,
      0,
    )
    if (candidate.getTime() <= now.getTime()) {
      candidate.setDate(candidate.getDate() + 1)
    }
    return candidate
  }

  const day = Math.min(28, Math.max(1, reminder.dayOfMonth ?? 1))
  let candidate = new Date(now.getFullYear(), now.getMonth(), day, h, m, 0, 0)
  if (candidate.getTime() <= now.getTime()) {
    candidate = new Date(now.getFullYear(), now.getMonth() + 1, day, h, m, 0, 0)
  }
  return candidate
}

export function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
}

function foldLine(line: string): string {
  if (line.length <= 73) return line
  const chunks: string[] = []
  for (let index = 0; index < line.length; index += 73) {
    chunks.push(line.slice(index, index + 73))
  }
  return chunks.join('\r\n ')
}

interface BuildReminderIcsParams {
  uid: string
  summary: string
  description: string
  url: string
  reminder: Pick<PlanReminder, 'frequency' | 'time' | 'dayOfMonth'>
  now: Date
}

export function buildReminderIcs({
  uid,
  summary,
  description,
  url,
  reminder,
  now,
}: BuildReminderIcsParams): string {
  const start = nextOccurrence(reminder, now)
  const end = new Date(start.getTime() + 15 * 60 * 1000)
  const day = Math.min(28, Math.max(1, reminder.dayOfMonth ?? 1))
  const rrule =
    reminder.frequency === 'daily'
      ? 'FREQ=DAILY'
      : `FREQ=MONTHLY;BYMONTHDAY=${day}`
  const title = escapeIcs(summary)

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TripSwap//Plan Reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:TripSwap reminders',
    'BEGIN:VEVENT',
    `UID:${escapeIcs(uid)}`,
    `DTSTAMP:${toIcsStamp(now)}`,
    `DTSTART:${toIcsLocal(start)}`,
    `DTEND:${toIcsLocal(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `URL:${url}`,
    `RRULE:${rrule}`,
    'STATUS:CONFIRMED',
    'TRANSP:TRANSPARENT',
    'CATEGORIES:TRIPSWAP',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${title}`,
    'TRIGGER:-PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return `${lines.map(foldLine).join('\r\n')}\r\n`
}

export function createReminderUid(destinationId: string): string {
  return `tripswap-${destinationId}@tripswap.local`
}

export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
