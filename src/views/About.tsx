import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
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
    <div>
      <section className="page pt-10 lg:pt-16">
        <p className="label-accent">{copy.about.eyebrow}</p>
        <h1 className="mt-3 max-w-5xl text-[clamp(2.8rem,7vw,6rem)] leading-[0.82] tracking-tightest text-ink">
          {copy.about.titleA}
          <br />
          {copy.about.titleB}{' '}
          <span className="text-accent">{copy.about.titleAccent}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
          {copy.about.intro}
        </p>
      </section>

      <section className="page mt-14 lg:mt-20">
        <div className="flex flex-wrap items-end justify-between gap-3 border-t-2 border-ink pt-4">
          <p className="label-accent">{copy.about.pillarsEyebrow}</p>
          <p className="label">{copy.about.pillarsTitle}</p>
        </div>

        <div className="mt-7 grid gap-8 md:grid-cols-3 md:gap-10">
          {copy.about.pillars.map((pillar, index) => (
            <div key={pillar.title}>
              <span className="nums text-[10px] text-accent">
                0{index + 1}
              </span>
              <h2 className="mt-2 text-[2rem] leading-[0.9] text-ink">
                {pillar.title}
              </h2>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-7 max-w-3xl text-[10px] leading-relaxed text-muted">
          {copy.about.pillarsNote}
        </p>
      </section>

      <section className="page mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="label-accent">{copy.about.transparencyEyebrow}</p>
          <h2 className="mt-2 text-[clamp(2rem,4vw,3.2rem)] leading-[0.9] text-ink">
            {copy.about.transparencyTitle}
          </h2>
          <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">
            {copy.about.transparencyBody}
          </p>

          <div className="mt-6">
            {formulas.map((formula) => (
              <div key={formula.label} className="border-t border-line py-3">
                <p className="label">{formula.label}</p>
                <p className="nums mt-1 text-[13px] text-ink">{formula.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-sky p-6 lg:p-8">
          <p className="label-accent">{copy.about.overlapEyebrow}</p>
          <p className="mt-3 text-[13px] leading-relaxed text-ink/75">
            {copy.about.overlapBody1}
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-ink/75">
            {copy.about.overlapBody2}
          </p>

          <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/65">
            {copy.about.groups.map((group, index) => (
              <span key={group}>
                {index > 0 && <span aria-hidden="true">· </span>}
                {group}
              </span>
            ))}
          </div>

          <p className="mt-6 border-t border-ink/15 pt-4 text-[10px] text-ink/65">
            {copy.about.stats(
              HABITS.length,
              DESTINATIONS.length,
              fmt.eur(minBudget),
              fmt.eur(maxBudget),
            )}
          </p>
        </div>
      </section>

      <section className="mt-16 bg-ink text-canvas">
        <div className="page grid gap-8 py-14 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:py-20">
          <p className="font-display text-[clamp(5rem,14vw,12rem)] font-semibold leading-[0.62] text-accent">
            €0<span className="align-top text-[0.2em]">*</span>
          </p>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-canvas/60">
              {copy.about.zeroEyebrow}
            </p>
            <h2 className="mt-2 text-[clamp(2rem,4vw,3.4rem)] leading-[0.88] text-canvas">
              {copy.about.zeroTitle}
            </h2>
            <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-canvas/60">
              {copy.about.zeroBody1}
            </p>
            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-canvas/60">
              {copy.about.zeroBody2}
            </p>
            <p className="mt-4 max-w-xl text-[10px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-accent">
              {copy.price.metaphor}
            </p>
          </div>
        </div>
      </section>

      <section className="page mt-16">
        <div className="border-t-2 border-ink pt-4">
          <p className="label-accent">{copy.about.limitsEyebrow}</p>
          <h2 className="mt-2 text-[clamp(1.7rem,3vw,2.4rem)] leading-none text-ink">
            {copy.about.limitsTitle}
          </h2>
        </div>

        <ul className="mt-7 grid gap-x-12 sm:grid-cols-2">
          {copy.about.limits.map((item) => (
            <li
              key={item}
              className="flex gap-3 border-t border-line py-3 text-[12px] leading-relaxed text-ink-soft"
            >
              <span className="text-accent" aria-hidden="true">
                —
              </span>
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-6 max-w-3xl border-l-2 border-accent pl-4 text-[11px] leading-relaxed text-muted">
          {copy.about.assumptionsNote}
        </p>
      </section>

      <section className="page mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4">
          <p className="label-accent">{copy.about.creditsEyebrow}</p>
          <p className="label">{copy.about.creditsTitle}</p>
        </div>

        <ul className="mt-5 grid gap-x-10 gap-y-2 text-[10px] leading-relaxed text-muted sm:grid-cols-2">
          {DESTINATIONS.map((destination) => (
            <li key={destination.id}>
              <span className="text-ink">{destination.name}:</span>{' '}
              {destination.imageCredit}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[10px] leading-relaxed text-muted">
          {copy.about.creditsNote}
        </p>
      </section>

      <section className="page mt-16 border-t-2 border-ink pb-16 pt-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="label-accent">{copy.about.closingEyebrow}</p>
            <p className="mt-2 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.6rem)] normal-case leading-[0.95] text-ink">
              {copy.about.closingLine}
            </p>
            <p className="mt-3 text-[10px] text-muted">{copy.about.languageNote}</p>
          </div>
          <Link to="/" className="btn-accent">
            {copy.about.closingCta}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
