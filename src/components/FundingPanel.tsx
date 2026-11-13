import { BookmarkCheck, BookmarkPlus, Lock, LockOpen } from 'lucide-react'
import type { PlanResult } from '../lib/calc'
import { HORIZONS, planState, type PlanState } from '../lib/planState'
import { formatEUR, formatMonths, formatPercent } from '../lib/format'
import { ProgressRail } from './ProgressRail'
import { NumberTicker } from './NumberTicker'
import { cn } from '../lib/cn'

const STATE_COPY: Record<PlanState, { label: string; hint: string }> = {
  discover: { label: 'Descobrir', hint: 'Escolhe as primeiras trocas para ver o prazo.' },
  'on-the-way': { label: 'A caminho', hint: 'Há um plano válido. O prazo está calculado.' },
  unlocked: {
    label: 'Desbloqueado na simulação',
    hint: 'A poupança projetada chega ao objetivo no teu horizonte.',
  },
  unreachable: {
    label: 'Fora de alcance',
    hint: 'Com estas trocas, o objetivo não chega em 20 anos.',
  },
}

interface HorizonPickerProps {
  value: number
  onChange: (value: number) => void
}

export function HorizonPicker({ value, onChange }: HorizonPickerProps) {
  return (
    <div>
      <p className="eyebrow">Horizonte</p>
      <div className="mt-2 grid grid-cols-4 gap-1" role="group" aria-label="Horizonte de planeamento">
        {HORIZONS.map((horizon) => (
          <button
            key={horizon}
            type="button"
            aria-pressed={value === horizon}
            onClick={() => onChange(horizon)}
            className={cn(
              'border py-2 text-[12px] font-medium transition-colors',
              value === horizon
                ? 'border-ink bg-ink text-paper'
                : 'border-line text-muted hover:border-ink/50 hover:text-ink',
            )}
          >
            {horizon}m
          </button>
        ))}
      </div>
    </div>
  )
}

interface FundingPanelProps {
  plan: PlanResult
  horizon: number
  onHorizon: (value: number) => void
  saved: boolean
  onSave: () => void
  className?: string
}

export function FundingPanel({
  plan,
  horizon,
  onHorizon,
  saved,
  onSave,
  className,
}: FundingPanelProps) {
  const state = planState(plan)
  const copy = STATE_COPY[state]

  return (
    <div className={cn('border border-line bg-white/70 p-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">{copy.label}</p>
        <span
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-full',
            state === 'unlocked' ? 'bg-clay text-paper' : 'bg-paper-2 text-ink-soft',
          )}
          aria-hidden="true"
        >
          {state === 'unlocked' ? (
            <LockOpen className="h-3.5 w-3.5" />
          ) : (
            <Lock className="h-3.5 w-3.5" />
          )}
        </span>
      </div>

      <div className="mt-4">
        {plan.monthsToTarget !== null ? (
          <>
            <p className="flex items-baseline gap-2">
              <NumberTicker
                value={plan.monthsToTarget}
                className="text-[3.4rem] leading-none text-ink"
              />
              <span className="text-sm text-muted">
                {plan.monthsToTarget === 1 ? 'mês' : 'meses'}
              </span>
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">
              para um objetivo de {formatEUR(plan.target)}. Projeção, não dinheiro já
              poupado.
            </p>
          </>
        ) : (
          <p className="font-display text-2xl leading-tight text-ink">{copy.hint}</p>
        )}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.14em] text-muted">Por mês</dt>
          <dd className="nums mt-1 text-lg text-ink">{formatEUR(plan.monthly)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.14em] text-muted">Uma vez</dt>
          <dd className="nums mt-1 text-lg text-ink">{formatEUR(plan.oneTime)}</dd>
        </div>
      </dl>

      <ProgressRail
        className="mt-5"
        progress={plan.progress}
        unlocked={plan.unlocked}
        label={`Progresso para o objetivo em ${horizon} meses`}
      />
      <div className="mt-2 flex justify-between text-[11px] text-muted">
        <span>{formatPercent(plan.progress)} em {horizon} meses</span>
        <span className="nums">
          {plan.unlocked ? 'objetivo atingido' : `faltam ${formatEUR(plan.remainingAtHorizon)}`}
        </span>
      </div>

      <div className="mt-6">
        <HorizonPicker value={horizon} onChange={onHorizon} />
      </div>

      <button type="button" onClick={onSave} className="btn-primary mt-5 w-full">
        {saved ? (
          <>
            <BookmarkCheck className="h-4 w-4" /> Plano guardado
          </>
        ) : (
          <>
            <BookmarkPlus className="h-4 w-4" /> Guardar este plano
          </>
        )}
      </button>

      <p className="mt-3 text-[10px] leading-relaxed text-muted">
        Guardado apenas neste dispositivo. A viagem não é gratuita: o €0* é a metáfora
        de um custo coberto pelas trocas escolhidas.
      </p>
    </div>
  )
}

interface MobileFundingBarProps {
  plan: PlanResult
  saved: boolean
  onSave: () => void
}

export function MobileFundingBar({ plan, saved, onSave }: MobileFundingBarProps) {
  const state = planState(plan)

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/15 bg-paper px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 lg:hidden">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-line">
        <div
          className={cn('h-full transition-all duration-700', plan.unlocked ? 'bg-clay' : 'bg-ink')}
          style={{ width: `${Math.round(plan.progress * 100)}%` }}
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
            {STATE_COPY[state].label}
          </p>
          <p className="mt-0.5 flex items-baseline gap-1.5 truncate">
            <span className="nums text-xl text-ink">
              {plan.monthsToTarget !== null ? formatMonths(plan.monthsToTarget) : '—'}
            </span>
            <span className="nums text-[11px] text-muted">
              · {formatEUR(plan.monthly)}/mês
            </span>
          </p>
        </div>
        <button type="button" onClick={onSave} className="btn-primary shrink-0 px-3 py-2.5 text-[12px]">
          {saved ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
          {saved ? 'Guardado' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}
