import type { PlanResult } from '../lib/calc'
import { useI18n } from '../i18n/context'

interface UnlockReceiptProps {
  plan: PlanResult
}

export function UnlockReceipt({ plan }: UnlockReceiptProps) {
  const { copy, habitText, fmt } = useI18n()

  if (plan.lines.length === 0) {
    return (
      <div className="border-t-2 border-ink py-10">
        <p className="font-display text-2xl uppercase text-ink">
          {copy.receipt.emptyTitle}
        </p>
        <p className="mt-2 max-w-md text-[12px] leading-relaxed text-muted">
          {copy.receipt.emptyBody}
        </p>
      </div>
    )
  }

  return (
    <section aria-labelledby="recibo" className="border-t-2 border-ink pt-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="recibo" className="text-[2rem] leading-none text-ink">
            {copy.receipt.title}
          </h2>
          <p className="mt-1.5 text-[11px] text-muted">{copy.receipt.subtitle}</p>
        </div>
        <span className="nums text-[10px] uppercase tracking-[0.12em] text-muted">
          {plan.lines.length} / {copy.reward.selected}
        </span>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-ink text-[9px] uppercase tracking-[0.14em] text-muted">
              <th scope="col" className="py-2 pr-4 font-semibold">
                {copy.receipt.headers.swap}
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-semibold">
                {copy.receipt.headers.calculation}
              </th>
              <th scope="col" className="py-2 text-right font-semibold">
                {copy.receipt.headers.value}
              </th>
            </tr>
          </thead>
          <tbody>
            {plan.lines.map((line) => {
              const text = habitText(line.habit)
              return (
                <tr key={line.habit.id} className="border-b border-line">
                  <td className="py-3 pr-4 align-top">
                    <p className="font-medium text-ink">{text.title}</p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-muted">
                      {text.assumptions}
                    </p>
                  </td>
                  <td className="nums py-3 pr-4 text-right align-top text-[10px] text-muted">
                    {line.habit.kind === 'recurring'
                      ? `(${fmt.eur(line.habit.originalCost, { cents: true })} − ${fmt.eur(
                          line.habit.alternativeCost,
                          { cents: true },
                        )}) × ${line.habit.monthlyFrequency}`
                      : `${fmt.eur(line.habit.originalCost, { cents: true })} − ${fmt.eur(
                          line.habit.alternativeCost,
                          { cents: true },
                        )}`}
                  </td>
                  <td className="nums py-3 text-right align-top text-[13px] text-ink">
                    {fmt.eur(line.monthly > 0 ? line.monthly : line.oneTime)}
                    <span className="ml-1 font-sans text-[9px] uppercase tracking-[0.1em] text-muted">
                      {line.monthly > 0 ? copy.common.perMonth : copy.common.oneTime}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-b border-line">
              <td className="py-3 pr-4 font-semibold text-ink" colSpan={2}>
                {copy.receipt.recurringTotal}
              </td>
              <td className="nums py-3 text-right font-semibold text-ink">
                {fmt.eur(plan.monthly)}
              </td>
            </tr>
            <tr className="border-b border-line">
              <td className="py-3 pr-4 font-semibold text-ink" colSpan={2}>
                {copy.receipt.oneTimeTotal}
              </td>
              <td className="nums py-3 text-right font-semibold text-ink">
                {fmt.eur(plan.oneTime)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <div>
          <p className="label">{copy.receipt.objective}</p>
          <p className="nums mt-1 text-[1.6rem] leading-none text-ink">
            {fmt.eur(plan.target)}
          </p>
        </div>
        <div>
          <p className="label">{copy.receipt.inHorizon(fmt.months(plan.horizonMonths))}</p>
          <p className="nums mt-1 text-[1.6rem] leading-none text-ink">
            {fmt.eur(plan.projectedAtHorizon)}
          </p>
        </div>
        <div>
          <p className="label">{copy.receipt.estimatedHorizon}</p>
          <p className="nums mt-1 text-[1.6rem] leading-none text-accent">
            {fmt.months(plan.monthsToTarget)}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-2 border-t border-line pt-4 text-[10.5px] leading-relaxed text-muted">
        {copy.receipt.notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </div>
    </section>
  )
}
