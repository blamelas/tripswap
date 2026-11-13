export type Locale = 'pt' | 'en'

export const LOCALES: Locale[] = ['pt', 'en']

export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: unknown): value is Locale {
  return value === 'pt' || value === 'en'
}
