import { describe, expect, it } from 'vitest'
import { formatEUR, formatMonths, formatPercent } from '../src/lib/format'

function normalise(value: string) {
  return value.replace(/\u00a0|\u202f/g, ' ')
}

describe('currency formatting', () => {
  it('formats whole euros without decimals', () => {
    expect(normalise(formatEUR(650))).toBe('650 €')
  })

  it('keeps cents when the value has them', () => {
    const formatted = normalise(formatEUR(32.4))
    expect(formatted).toContain('32,4')
    expect(formatted).toContain('€')
  })

  it('can force whole euros for compact display', () => {
    expect(normalise(formatEUR(32.4, { whole: true }))).toBe('32 €')
  })
})

describe('label formatting', () => {
  it('handles singular and plural months', () => {
    expect(formatMonths(1)).toBe('1 mês')
    expect(formatMonths(11)).toBe('11 meses')
    expect(formatMonths(null)).toBe('sem prazo estimado')
  })

  it('formats percentages', () => {
    expect(formatPercent(0.563)).toBe('56%')
    expect(formatPercent(1)).toBe('100%')
  })
})
