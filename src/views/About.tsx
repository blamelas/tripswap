import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, Minus } from 'lucide-react'
import { DESTINATIONS } from '../data/destinations'
import { HABITS } from '../data/habits'
import { useI18n } from '../i18n/context'

export function About() {
  const { copy, fmt } = useI18n()
  const budgets = DESTINATIONS.map((destination) => destination.budget)
  const minBudget = Math.min(...budgets)
  const maxBudget = Math.max(...budgets)
  const formulas = [
    {
      label: copy.about.formulas.recurringLabel,
      value: copy.about.formulas.recurringValue,
    },
    {
      label: copy.about.formulas.oneTimeLabel,
      value: copy.about.formulas.oneTimeValue,
    },
    {
      label: copy.about.formulas.projectionLabel,
      value: copy.about.formulas.projectionValue,
    },
  ]

  return (
    <div className="pb-16">
      <section className="page pt-12 lg:pt-16">
        <p className="eyebrow">{copy.about.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,5.5vw,4.4rem)] leading-[1.02] tracking-tightest text-ink">
          {copy.about.titleA}
          <br />
          {copy.about.titleB}{' '}
          <em className="italic text-clay">{copy.about.titleAccent}</em>
        </h1>
        <p className="mt-6 max-w-2xl text-[15.5px] leading-relaxed text-ink-soft">
          {copy.about.intro}
        </p>
      </section>

      <section className="page mt-16" aria-labelledby="pilares">
        <div className="border-b border-line pb-4">
          <p className="eyebrow">{copy.about.pillarsEyebrow}</p>
          <h2
            id="pilares"
            className="mt-2 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none text-ink"
          >
            {copy.about.pillarsTitle}
          </h2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {copy.about.pillars.map((pillar, index) => (
            <div key={pillar.title} className="border border-line bg-white/50 p-6">
              <span className="nums text-[11px] text-clay">0{index + 1}</span>
              <h3 className="mt-3 font-display text-2xl text-ink">{pillar.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-3xl text-[11px] leading-relaxed text-muted">
          {copy.about.pillarsNote}
        </p>
      </section>

      <section className="page mt-16" aria-labelledby="calculo">
        <div className="grid gap-10 border border-line bg-white/50 p-6 sm:p-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="eyebrow">{copy.about.transparencyEyebrow}</p>
            <h2
              id="calculo"
              className="mt-2 font-display text-[clamp(1.8rem,3.2vw,2.5rem)] leading-tight text-ink"
            >
              {copy.about.transparencyTitle}
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
              {copy.about.transparencyBody}
            </p>

            <div className="mt-6 space-y-3">
              {formulas.map((formula) => (
                <div key={formula.label} className="border-l-2 border-clay pl-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
                    {formula.label}
                  </p>
                  <p className="nums mt-1 text-[13px] text-ink">{formula.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="eyebrow">{copy.about.overlapEyebrow}</p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
              {copy.about.overlapBody1}
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
              {copy.about.overlapBody2}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {copy.about.groups.map((group) => (
                <span
                  key={group}
                  className="border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-muted"
                >
                  {group}
                </span>
              ))}
            </div>
            <p className="mt-5 text-[11px] leading-relaxed text-muted">
              {copy.about.stats(
                HABITS.length,
                DESTINATIONS.length,
                fmt.eur(minBudget),
                fmt.eur(maxBudget),
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="page mt-16" aria-labelledby="zero">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="border border-clay/30 bg-clay-soft/40 p-6 sm:p-8">
            <p className="font-display text-[clamp(3rem,7vw,4.6rem)] leading-none text-clay">
              €0<span className="align-top text-xl">*</span>
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-clay-dark">
              {copy.about.zeroEyebrow}
            </p>
          </div>
          <div>
            <h2
              id="zero"
              className="font-display text-[clamp(1.7rem,3vw,2.3rem)] leading-tight text-ink"
            >
              {copy.about.zeroTitle}
            </h2>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-ink-soft">
              {copy.about.zeroBody1}
            </p>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-ink-soft">
              {copy.about.zeroBody2}
            </p>
          </div>
        </div>
      </section>

      <section className="page mt-16" aria-labelledby="limites">
        <div className="border-b border-line pb-4">
          <p className="eyebrow">{copy.about.limitsEyebrow}</p>
          <h2
            id="limites"
            className="mt-2 font-display text-[clamp(1.8rem,3.2vw,2.4rem)] leading-none text-ink"
          >
            {copy.about.limitsTitle}
          </h2>
        </div>
        <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {copy.about.limits.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-soft"
            >
              <Minus className="mt-1 h-3.5 w-3.5 shrink-0 text-clay" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-start gap-2.5 border border-line bg-white/50 p-4 text-[12px] leading-relaxed text-muted">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden="true" />
          <p>{copy.about.assumptionsNote}</p>
        </div>
      </section>

      <section className="page mt-16" aria-labelledby="creditos">
        <div className="border-b border-line pb-4">
          <p className="eyebrow">{copy.about.creditsEyebrow}</p>
          <h2 id="creditos" className="mt-2 font-display text-xl text-ink">
            {copy.about.creditsTitle}
          </h2>
        </div>
        <ul className="mt-5 grid gap-2 text-[11.5px] leading-relaxed text-muted sm:grid-cols-2">
          {DESTINATIONS.map((destination) => (
            <li key={destination.id}>
              <span className="text-ink">{destination.name}:</span>{' '}
              {destination.imageCredit}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] leading-relaxed text-muted">
          {copy.about.creditsNote}
        </p>
      </section>

      <section className="page mt-16">
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
          <div>
            <p className="eyebrow">{copy.about.closingEyebrow}</p>
            <p className="mt-2 max-w-md font-display text-xl leading-snug text-ink">
              {copy.about.closingLine}
            </p>
            <p className="mt-3 text-[11px] text-muted">{copy.about.languageNote}</p>
          </div>
          <Link to="/" className="btn-primary">
            {copy.about.closingCta}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
