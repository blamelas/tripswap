import { Info } from 'lucide-react'
import type { PlanResult } from '../lib/calc'
import { formatEUR, formatMonths } from '../lib/format'

interface UnlockReceiptProps {
  plan: PlanResult
}

export function UnlockReceipt({ plan }: UnlockReceiptProps) {
  if (plan.lines.length === 0) {
    return (
      <div className="border border-dashed border-line p-8 text-center">
        <p className="font-display text-xl text-ink">Ainda não há trocas escolhidas.</p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Escolhe uma troca acima — ou aplica um plano sugerido — para veres a conta
          completa, linha a linha.
        </p>
      </div>
    )
  }

  return (
    <section aria-labelledby="recibo" className="border border-line bg-white/60">
      <div className="flex items-start justify-between gap-4 border-b border-line p-5">
        <div>
          <h2 id="recibo" className="font-display text-2xl text-ink">
            Como calculámos
          </h2>
          <p className="mt-1 text-[12px] text-muted">
            Cada linha é reproduzível a partir das premissas visíveis.
          </p>
        </div>
        <Info className="mt-1 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-line text-[10px] uppercase tracking-[0.12em] text-muted">
              <th scope="col" className="p-4 font-medium">Troca</th>
              <th scope="col" className="p-4 text-right font-medium">Cálculo</th>
              <th scope="col" className="p-4 text-right font-medium">Valor</th>
            </tr>
          </thead>
          <tbody>
            {plan.lines.map((line) => (
              <tr key={line.habit.id} className="border-b border-line/70 last:border-b-0">
                <td className="p-4 align-top">
                  <p className="font-medium text-ink">{line.habit.title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                    {line.habit.assumptions}
                  </p>
                </td>
                <td className="nums p-4 text-right align-top text-[11px] text-muted">
                  {line.habit.kind === 'recurring'
                    ? `(${formatEUR(line.habit.originalCost)} − ${formatEUR(
                        line.habit.alternativeCost,
                      )}) × ${line.habit.monthlyFrequency}`
                    : `${formatEUR(line.habit.originalCost)} − ${formatEUR(
                        line.habit.alternativeCost,
                      )}`}
                </td>
                <td className="nums p-4 text-right align-top text-ink">
                  {formatEUR(line.monthly > 0 ? line.monthly : line.oneTime)}
                  <span className="ml-1 text-[10px] text-muted">
                    {line.monthly > 0 ? '/mês' : 'uma vez'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-paper-2/60">
              <td className="p-4 font-semibold text-ink" colSpan={2}>
                Poupança recorrente por mês
              </td>
              <td className="nums p-4 text-right font-semibold text-ink">
                {formatEUR(plan.monthly)}
              </td>
            </tr>
            <tr className="bg-paper-2/60">
              <td className="p-4 font-semibold text-ink" colSpan={2}>
                Poupança pontual (uma só vez)
              </td>
              <td className="nums p-4 text-right font-semibold text-ink">
                {formatEUR(plan.oneTime)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid gap-4 border-t border-line p-5 sm:grid-cols-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted">Objetivo</p>
          <p className="nums mt-1 text-lg text-ink">{formatEUR(plan.target)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
            Em {plan.horizonMonths} meses
          </p>
          <p className="nums mt-1 text-lg text-ink">{formatEUR(plan.projectedAtHorizon)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted">Prazo estimado</p>
          <p className="nums mt-1 text-lg text-ink">{formatMonths(plan.monthsToTarget)}</p>
        </div>
      </div>

      <div className="space-y-2 border-t border-line p-5 text-[11px] leading-relaxed text-muted">
        <p>
          Poupança projetada = poupança mensal × meses + poupanças pontuais. As
          poupanças pontuais entram uma única vez e nunca são tratadas como rendimento
          mensal.
        </p>
        <p>
          Trocas que assumem as mesmas despesas pertencem ao mesmo grupo e só uma pode
          estar ativa. É por isso que escolher uma substitui a outra, em vez de somar.
        </p>
        <p>
          Valores ilustrativos, definidos para este projeto. Não são médias de mercado,
          nem poupança garantida, nem uma oferta de viagem.
        </p>
      </div>
    </section>
  )
}
