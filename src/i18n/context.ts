import { createContext, useContext } from 'react'
import {
  formatDate,
  formatEUR,
  formatMonths,
  formatPercent,
  type EURFormatOptions,
} from '../lib/format'
import type { Destination, Habit } from '../types'
import {
  benefitEn,
  destinationEn,
  habitEn,
  type DestinationText,
  type HabitText,
} from './content'
import { en } from './en'
import { pt, type Copy } from './pt'
import type { Locale } from './types'

export interface I18nValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  copy: Copy
  habitText: (habit: Habit) => HabitText
  destinationText: (destination: Destination) => DestinationText
  benefitLabel: (tag: string) => string
  fmt: {
    eur: (value: number, options?: EURFormatOptions) => string
    months: (months: number | null) => string
    date: (iso: string) => string
    percent: (value: number) => string
  }
}

function ptHabitText(habit: Habit): HabitText {
  return {
    title: habit.title,
    description: habit.description,
    assumptions: habit.assumptions,
  }
}

function ptDestinationText(destination: Destination): DestinationText {
  return {
    quote: destination.quote,
    description: destination.description,
    imageAlt: destination.imageAlt,
    includes: destination.includes,
    country: destination.country,
  }
}

export function buildI18n(locale: Locale, setLocale: (locale: Locale) => void): I18nValue {
  return {
    locale,
    setLocale,
    copy: locale === 'pt' ? pt : en,
    habitText: (habit) =>
      locale === 'en'
        ? (habitEn[habit.id] ?? ptHabitText(habit))
        : ptHabitText(habit),
    destinationText: (destination) =>
      locale === 'en'
        ? (destinationEn[destination.id] ?? ptDestinationText(destination))
        : ptDestinationText(destination),
    benefitLabel: (tag) => (locale === 'en' ? (benefitEn[tag] ?? tag) : tag),
    fmt: {
      eur: (value, options) => formatEUR(value, { ...options, locale }),
      months: (months) => formatMonths(months, locale),
      date: (iso) => formatDate(iso, locale),
      percent: formatPercent,
    },
  }
}

export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n(): I18nValue {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside I18nProvider')
  return value
}
