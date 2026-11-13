import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Languages } from 'lucide-react'
import { useI18n } from '../i18n/context'
import { cn } from '../lib/cn'

function Brand() {
  return (
    <NavLink to="/" className="group inline-flex items-center gap-2.5" aria-label="TripSwap">
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="currentColor" className="text-clay" />
        <path
          d="M7.4 16.6 16.6 7.4"
          fill="none"
          stroke="#F6F2E9"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="6.6" cy="17.4" r="2" fill="#F6F2E9" />
        <circle cx="17.4" cy="6.6" r="2" fill="#F6F2E9" />
      </svg>
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] sm:text-[13px] sm:tracking-[0.26em]">
        TripSwap
      </span>
    </NavLink>
  )
}

function LanguageToggle() {
  const { locale, setLocale, copy } = useI18n()
  const next = locale === 'pt' ? 'en' : 'pt'
  const label = locale === 'pt' ? copy.nav.toEnglish : copy.nav.toPortuguese

  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={label}
      title={label}
      className="ml-1 inline-flex h-8 shrink-0 items-center gap-1.5 border border-line px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink sm:ml-3 sm:px-2.5"
    >
      <Languages className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="hidden sm:inline">{locale === 'pt' ? 'EN' : 'PT'}</span>
    </button>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export function Layout() {
  const { copy } = useI18n()

  const links = [
    { to: '/', label: copy.nav.discover, short: copy.nav.discover, end: true },
    { to: '/unlocks', label: copy.nav.unlocks, short: copy.nav.unlocksShort, end: false },
    { to: '/about', label: copy.nav.about, short: copy.nav.about, end: false },
  ]

  return (
    <div className="flex min-h-svh flex-col">
      <ScrollToTop />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        {copy.nav.skip}
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-paper">
        <div className="page flex h-16 items-center justify-between gap-2 sm:gap-6">
          <Brand />
          <div className="flex items-center">
            <nav aria-label="Navigation" className="flex items-center gap-0.5 sm:gap-6">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  aria-label={link.label}
                  className={({ isActive }) =>
                    cn(
                      'relative px-1.5 py-2 text-[10.5px] uppercase tracking-[0.08em] transition-colors sm:px-1 sm:text-[11px] sm:tracking-[0.18em]',
                      isActive ? 'text-ink' : 'text-muted hover:text-ink',
                      isActive &&
                        'after:absolute after:-bottom-[1px] after:left-0 after:h-[2px] after:w-full after:bg-clay',
                    )
                  }
                >
                  <span className="sm:hidden">{link.short}</span>
                  <span className="hidden sm:inline">{link.label}</span>
                </NavLink>
              ))}
            </nav>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-24 border-t border-line">
        <div className="page grid gap-10 py-14 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Brand />
            <p className="mt-5 max-w-xs font-display text-xl leading-snug text-ink-soft">
              {copy.footer.tagline}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {copy.footer.blurb}
            </p>
          </div>

          <div className="text-sm">
            <p className="eyebrow">{copy.footer.explore}</p>
            <ul className="mt-4 space-y-2">
              <li>
                <NavLink to="/" className="link-underline">
                  {copy.footer.catalogue}
                </NavLink>
              </li>
              <li>
                <NavLink to="/unlocks" className="link-underline">
                  {copy.footer.unlocks}
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="link-underline">
                  {copy.footer.how}
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="text-sm text-muted">
            <p className="eyebrow">{copy.footer.honest}</p>
            <p className="mt-4 leading-relaxed">{copy.footer.honestBody}</p>
            <p className="mt-4">{copy.footer.project}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
