import { describe, expect, it } from 'vitest'
import { DESTINATIONS } from '../src/data/destinations'
import { HABITS } from '../src/data/habits'
import { benefitEn, destinationEn, habitEn } from '../src/i18n/content'
import { en } from '../src/i18n/en'
import { pt } from '../src/i18n/pt'
import { formatEUR, formatMonths } from '../src/lib/format'

function normalise(value: string) {
  return value.replace(/\u00a0|\u202f/g, ' ')
}

function shape(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return [
      `${prefix}<${value.length}>`,
      ...value.flatMap((item, index) => shape(item, `${prefix}[${index}]`)),
    ]
  }
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, item]) =>
      shape(item, prefix ? `${prefix}.${key}` : key),
    )
  }
  if (typeof value === 'function') return [`${prefix}()`]
  return [prefix]
}

describe('translation parity', () => {
  it('has the same keys, arrays and function signatures in PT and EN', () => {
    expect(shape(en).sort()).toEqual(shape(pt).sort())
  })
})

describe('english content', () => {
  it('covers every habit with non-empty copy', () => {
    expect(Object.keys(habitEn).sort()).toEqual(HABITS.map((habit) => habit.id).sort())
    for (const habit of HABITS) {
      const text = habitEn[habit.id]
      expect(text, habit.id).toBeDefined()
      expect(text.title.length, habit.id).toBeGreaterThan(3)
      expect(text.description.length, habit.id).toBeGreaterThan(10)
      expect(text.assumptions.length, habit.id).toBeGreaterThan(5)
    }
  })

  it('covers every destination, including the same number of inclusions', () => {
    expect(Object.keys(destinationEn).sort()).toEqual(
      DESTINATIONS.map((destination) => destination.id).sort(),
    )
    for (const destination of DESTINATIONS) {
      const text = destinationEn[destination.id]
      expect(text, destination.id).toBeDefined()
      expect(text.country.length).toBeGreaterThan(2)
      expect(text.quote.length).toBeGreaterThan(5)
      expect(text.description.length).toBeGreaterThan(20)
      expect(text.imageAlt.length).toBeGreaterThan(5)
      expect(text.includes).toHaveLength(destination.includes.length)
      expect(text.includes.every((item) => item.trim().length > 0)).toBe(true)
    }
  })

  it('translates every benefit tag used by a habit', () => {
    const tags = new Set(HABITS.flatMap((habit) => habit.benefits))
    for (const tag of tags) {
      expect(benefitEn[tag], tag).toBeDefined()
      expect(benefitEn[tag].length).toBeGreaterThan(2)
    }
  })
})

describe('localised formatting', () => {
  it('formats euros for each locale', () => {
    expect(normalise(formatEUR(650))).toBe('650 €')
    expect(formatEUR(650, { locale: 'en' })).toBe('€650')
    expect(normalise(formatEUR(0.4, { cents: true }))).toBe('0,40 €')
    expect(formatEUR(0.4, { locale: 'en', cents: true })).toBe('€0.40')
  })

  it('formats month labels for each locale', () => {
    expect(formatMonths(1, 'en')).toBe('1 month')
    expect(formatMonths(6, 'en')).toBe('6 months')
    expect(formatMonths(null, 'en')).toBe('no estimated horizon')
    expect(formatMonths(1, 'pt')).toBe('1 mês')
    expect(formatMonths(6, 'pt')).toBe('6 meses')
  })
})
