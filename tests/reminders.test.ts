import { describe, expect, it } from 'vitest'
import {
  buildReminderIcs,
  escapeIcs,
  nextOccurrence,
  toIcsLocal,
} from '../src/lib/reminders'

const now = new Date(2026, 10, 13, 10, 0, 0)

describe('reminder scheduling', () => {
  it('schedules a daily reminder at the next occurrence', () => {
    const next = nextOccurrence({ frequency: 'daily', time: '09:00' }, now)
    expect(toIcsLocal(next)).toBe('20261114T090000')
  })

  it('schedules a daily reminder today when the time has not passed', () => {
    const next = nextOccurrence({ frequency: 'daily', time: '11:30' }, now)
    expect(toIcsLocal(next)).toBe('20261113T113000')
  })

  it('schedules a monthly reminder on a future day this month', () => {
    const next = nextOccurrence(
      { frequency: 'monthly', time: '09:00', dayOfMonth: 20 },
      now,
    )
    expect(toIcsLocal(next)).toBe('20261120T090000')
  })

  it('moves a monthly reminder to next month when the day has passed', () => {
    const next = nextOccurrence(
      { frequency: 'monthly', time: '09:00', dayOfMonth: 1 },
      now,
    )
    expect(toIcsLocal(next)).toBe('20261201T090000')
  })
})

describe('calendar export', () => {
  it('builds a daily calendar event with a reminder', () => {
    const ics = buildReminderIcs({
      uid: 'tripswap-paris@tripswap.local',
      summary: 'TripSwap — review Paris',
      description: '3 swaps · €122/month · 6 months · €650 target',
      url: 'https://tripswap-home.vercel.app/destination/paris-city-break',
      reminder: { frequency: 'daily', time: '09:00' },
      now,
    })

    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('RRULE:FREQ=DAILY')
    expect(ics).toContain('DTSTART:20261114T090000')
    expect(ics).toContain('DTEND:20261114T091500')
    expect(ics).toContain('BEGIN:VALARM')
    expect(ics).toContain('ACTION:DISPLAY')
    expect(ics).toContain('TRIGGER:-PT0M')
    expect(ics).toContain('UID:tripswap-paris@tripswap.local')
    expect(ics.includes('\r\n')).toBe(true)
  })

  it('builds a monthly rule on the chosen day', () => {
    const ics = buildReminderIcs({
      uid: 'tripswap-paris@tripswap.local',
      summary: 'TripSwap — review Paris',
      description: 'Plan',
      url: 'https://example.com',
      reminder: { frequency: 'monthly', time: '09:00', dayOfMonth: 20 },
      now,
    })

    expect(ics).toContain('RRULE:FREQ=MONTHLY;BYMONTHDAY=20')
    expect(ics).toContain('DTSTART:20261120T090000')
  })

  it('escapes reserved calendar characters', () => {
    expect(escapeIcs('A, B; C\\D\nE')).toBe('A\\, B\\; C\\\\D\\nE')
  })
})
