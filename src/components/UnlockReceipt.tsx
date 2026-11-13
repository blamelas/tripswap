import { Info } from 'lucide-react'
import type { PlanResult } from '../lib/calc'
import { useI18n } from '../i18n/context'

interface UnlockReceiptProps {
  plan: PlanResult
}

export function UnlockReceipt({ plan }: UnlockReceiptProps) {
  const { copy, habitText, fmt } = useI18n()

  if (plan.lines.length === 0) {
    return (
      <div className="border border-dashed border-line p-8 text-center">
        <p className="font-display text-xl text-ink">{copy.receipt.emptyTitle}</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          {copy.receipt.emptyBody}
        </p>
      </div>
    )
  }

  return (
    <section aria-labelledby="recibo" className="border border-line bg-white/60">
      <div className="flex items-start justify-between gap-4 border-b border-line p-5">
        <div>
          <h2 id="recibo" className="font-display text-2xl text-ink">
            {copy.receipt.title}
          </h2>
          <p className="mt-1 text-[12px] text-muted">{copy.receipt.subtitle}</p>
        </div>
        <Info className="mt-1 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-line text-[10px] uppercase tracking-[0.12em] text-muted">
              <th scope="col" className="p-4 font-medium">
                {copy.receipt.headers.swap}
              </th>
              <th scope="col" className="p-4 text-right font-medium">
                {copy.receipt.headers.calculation}
              </th>
              <th scope="col" className="p-4 text-right font-medium">
                {copy.receipt.headers.value}
              </th>
            </tr>
          </thead>
          <tbody>
            {plan.lines.map((line) => {
              const text = habitText(line.habit)
              return (
                <tr key={line.habit.id} className="border-b border-line/70 last:border-b-0">
                  <td className="p-4 align-top">
                    <p className="font-medium text-ink">{text.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                      {text.assumptions}
                    </p>
                  </td>
                  <td className="nums p-4 text-right align-top text-[11px] text-muted">
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
                  <td className="nums p-4 text-right align-top text-ink">
                    {fmt.eur(line.monthly > 0 ? line.monthly : line.oneTime)}
                    <span className="ml-1 text-[10px] text-muted">
                      {line.monthly > 0 ? copy.common.perMonth : copy.common.oneTime}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="bg-paper-2/60">
              <td className="p-4 font-semibold text-ink" colSpan={2}>
                {copy.receipt.recurringTotal}
              </td>
              <td className="nums p-4 text-right font-semibold text-ink">
                {fmt.eur(plan.monthly)}
              </td>
            </tr>
            <tr className="bg-paper-2/60">
              <td className="p-4 font-semibold text-ink" colSpan={2}>
                {copy.receipt.oneTimeTotal}
              </td>
              <td className="nums p-4 text-right font-semibold text-ink">
                {fmt.eur(plan.oneTime)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid gap-4 border-t border-line p-5 sm:grid-cols-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
            {copy.receipt.objective}
          </p>
          <p className="nums mt-1 text-lg text-ink">{fmt.eur(plan.target)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
            {copy.receipt.inHorizon(fmt.months(plan.horizonMonths))}
          </p>
          <p className="nums mt-1 text-lg text-ink">{fmt.eur(plan.projectedAtHorizon)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
            {copy.receipt.estimatedHorizon}
          </p>
          <p className="nums mt-1 text-lg text-ink">{fmt.months(plan.monthsToTarget)}</p>
        </div>
      </div>

      <div className="space-y-2 border-t border-line p-5 text-[11px] leading-relaxed text-muted">
        {copy.receipt.notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </div>
    </section>
  )
}
