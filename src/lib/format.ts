import type { Locale } from '../i18n/types'

export interface EURFormatOptions {
  whole?: boolean
  cents?: boolean
  locale?: Locale
}

const TAGS: Record<Locale, string> = { pt: 'pt-PT', en: 'en-IE' }

function makeFormatters(min: number, max: number) {
  return {
    pt: new Intl.NumberFormat(TAGS.pt, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    }),
    en: new Intl.NumberFormat(TAGS.en, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    }),
  }
}

const eur = makeFormatters(0, 2)
const eurWhole = makeFormatters(0, 0)
const eurCents = makeFormatters(2, 2)

export function formatEUR(value: number, options: EURFormatOptions = {}): string {
  const locale = options.locale ?? 'pt'
  if (options.cents) return eurCents[locale].format(value)
  if (options.whole || Number.isInteger(value)) return eurWhole[locale].format(value)
  return eur[locale].format(value)
}

export function formatMonths(months: number | null, locale: Locale = 'pt'): string {
  if (months === null) {
    return locale === 'pt' ? 'sem prazo estimado' : 'no estimated horizon'
  }
  if (locale === 'pt') return months === 1 ? '1 mês' : `${months} meses`
  return months === 1 ? '1 month' : `${months} months`
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function formatDate(iso: string, locale: Locale = 'pt'): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
