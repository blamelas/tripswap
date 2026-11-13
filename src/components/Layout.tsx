import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useI18n } from '../i18n/context'
import { cn } from '../lib/cn'

function Mark({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const background = tone === 'light' ? '#151A19' : '#F7F6F2'
  const foreground = tone === 'light' ? '#F7F6F2' : '#151A19'

  return (
    <svg viewBox="0 0 28 28" className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" aria-hidden="true">
      <rect width="28" height="28" fill={background} />
      <circle cx="14" cy="11.5" r="7.5" fill={foreground} />
      <rect y="17.5" width="28" height="2.5" fill="#FF5936" />
    </svg>
  )
}

function Brand({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <NavLink to="/" className="inline-flex items-center gap-2 sm:gap-2.5" aria-label="TripSwap">
      <Mark tone={tone} />
      <span
        className={cn(
          'font-display text-[19px] font-bold uppercase leading-none tracking-[0.01em] sm:text-[25px]',
          tone === 'dark' ? 'text-canvas' : 'text-ink',
        )}
      >
        TRIP<span className="text-accent">SWAP</span>
      </span>
    </NavLink>
  )
}

function LanguageToggle() {
  const { locale, setLocale, copy } = useI18n()

  return (
    <div className="flex items-center gap-1" role="group" aria-label={copy.nav.language}>
      {(['en', 'pt'] as const).map((value, index) => (
        <span key={value} className="flex items-center gap-1.5">
          {index > 0 && (
            <span className="text-[9px] text-line" aria-hidden="true">
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => setLocale(value)}
            aria-pressed={locale === value}
            aria-label={value === 'en' ? copy.nav.toEnglish : copy.nav.toPortuguese}
            className={cn(
              'border-b pb-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] transition-colors',
              locale === value ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink',
            )}
          >
            {value}
          </button>
        </span>
      ))}
    </div>
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
    { to: '/', label: copy.nav.discover, short: copy.nav.placesShort, end: true },
    {
      to: '/swaps',
      label: copy.nav.swaps,
      short: copy.nav.swapsShort,
      end: false,
    },
    { to: '/unlocks', label: copy.nav.unlocks, short: copy.nav.unlocksShort, end: false },
    { to: '/about', label: copy.nav.about, end: false, hideOnMobile: true },
  ]

  return (
    <div className="flex min-h-svh flex-col">
      <ScrollToTop />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
      >
        {copy.nav.skip}
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-canvas">
        <div className="page flex h-14 items-center justify-between gap-2 lg:h-16">
          <Brand />
          <div className="flex items-center gap-3 lg:gap-8">
            <nav aria-label={copy.nav.menu} className="flex items-center gap-2 lg:gap-7">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  aria-label={link.label}
                  className={({ isActive }) =>
                    cn(
                      'border-b-2 pb-0.5 text-[9px] font-semibold uppercase tracking-[0.05em] transition-colors lg:text-[10.5px] lg:tracking-[0.14em]',
                      isActive
                        ? 'border-accent text-ink'
                        : 'border-transparent text-muted hover:text-ink',
                      link.hideOnMobile && 'hidden sm:inline-flex',
                    )
                  }
                >
                  <span className="sm:hidden">{link.short ?? link.label}</span>
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

      <footer className="mt-24 bg-ink text-canvas">
        <div className="page grid gap-10 py-14 lg:grid-cols-[1.35fr_0.85fr_0.85fr] lg:gap-14 lg:py-20">
          <div>
            <Brand tone="dark" />
            <p className="mt-10 font-display text-[clamp(2.6rem,5.5vw,4.6rem)] font-semibold uppercase leading-[0.84] tracking-tightest">
              {copy.discover.headline.line1}
              <br />
              {copy.discover.headline.line2}{' '}
              <span className="text-accent">{copy.discover.headline.accent}</span>
            </p>
          </div>

          <div className="text-sm">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-canvas/60">
              {copy.footer.explore}
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <NavLink to="/" className="text-canvas/75 transition-colors hover:text-accent">
                  {copy.footer.catalogue}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/swaps"
                  className="text-canvas/75 transition-colors hover:text-accent"
                >
                  {copy.footer.swaps}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/unlocks"
                  className="text-canvas/75 transition-colors hover:text-accent"
                >
                  {copy.footer.unlocks}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className="text-canvas/75 transition-colors hover:text-accent"
                >
                  {copy.footer.how}
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="text-[12px] leading-relaxed text-canvas/70">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-canvas/60">
              {copy.footer.honest}
            </p>
            <p className="mt-4">{copy.footer.honestBody}</p>
            <p className="mt-4 text-canvas/60">{copy.footer.project}</p>
          </div>
        </div>

        <div className="border-t border-canvas/15">
          <div className="page flex flex-wrap items-center justify-between gap-3 py-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-canvas/60">
            <span>
              {copy.discover.stats[0]} · {copy.discover.stats[1]}
            </span>
            <span>EST. 2026 · LISBON</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
