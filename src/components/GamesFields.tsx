import { useState } from 'react'
import type { GamesEstimate } from '../types'
import { useI18n } from '../i18n/context'

interface GamesFieldsProps {
  estimate: GamesEstimate | null
  onSave: (estimate: GamesEstimate) => void
}

export function GamesFields({ estimate, onSave }: GamesFieldsProps) {
  const { copy, fmt } = useI18n()
  const [current, setCurrent] = useState(
    estimate ? String(estimate.current) : '',
  )
  const [reduced, setReduced] = useState(
    estimate ? String(estimate.reduced) : '',
  )

  const hasInputs = current !== '' && reduced !== ''
  const currentValue = Number(current)
  const reducedValue = Number(reduced)
  const valid =
    hasInputs &&
    Number.isFinite(currentValue) &&
    Number.isFinite(reducedValue) &&
    currentValue >= 0 &&
    reducedValue >= 0 &&
    reducedValue <= currentValue
  const saving = valid ? Math.max(0, currentValue - reducedValue) : 0

  return (
    <div className="mt-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
          {copy.games.current}
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
            className="border border-line bg-canvas px-2 py-1.5 text-[12px] text-ink"
          />
        </label>
        <label className="flex flex-col gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
          {copy.games.reduced}
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={reduced}
            onChange={(event) => setReduced(event.target.value)}
            className="border border-line bg-canvas px-2 py-1.5 text-[12px] text-ink"
          />
        </label>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <button
          type="button"
          onClick={() => {
            setCurrent('20')
            setReduced('15')
            onSave({ current: 20, reduced: 15 })
          }}
          className="text-[9px] font-semibold uppercase tracking-[0.12em] text-accent-dark underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
        >
          {copy.games.example}
        </button>
        <p className="text-[9px] leading-relaxed text-muted">{copy.games.exampleNote}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-start gap-x-5 gap-y-3">
        <button
          type="button"
          disabled={!valid}
          onClick={() => onSave({ current: currentValue, reduced: reducedValue })}
          className="btn-primary px-3 py-2 text-[10px]"
        >
          {copy.games.save}
        </button>
        {hasInputs && valid ? (
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
              {copy.games.estimated}
            </p>
            <p className="nums mt-0.5 text-[1.8rem] leading-none text-accent-dark">
              {fmt.eur(saving)}
              <span className="ml-1 font-sans text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
                {copy.common.perMonth}
              </span>
            </p>
          </div>
        ) : (
          <p className="max-w-xs text-[10px] leading-relaxed text-muted">
            {hasInputs && !valid ? copy.games.invalid : copy.games.hint}
          </p>
        )}
      </div>
    </div>
  )
}
