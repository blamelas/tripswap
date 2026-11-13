import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { readLocale, writeLocale } from '../lib/storage'
import { buildI18n, I18nContext } from './context'
import type { Locale } from './types'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readLocale())

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    writeLocale(next)
  }, [])

  const value = useMemo(() => buildI18n(locale, setLocale), [locale, setLocale])

  useEffect(() => {
    document.documentElement.lang = locale === 'pt' ? 'pt-PT' : 'en'
    document.title = value.copy.meta.title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', value.copy.meta.description)
  }, [locale, value])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
