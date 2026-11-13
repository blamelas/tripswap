import { useEffect, useId, useRef, useState } from 'react'
import type { AllocationConflictKind } from '../lib/allocations'
import type { ActivationDecision } from '../lib/activation'
import { useI18n } from '../i18n/context'
import { cn } from '../lib/cn'

export interface ActivationConflictChoice {
  habitId: string
  habitTitle: string
  kind: AllocationConflictKind
  /** Display name of the other destination; empty for one-time conflicts. */
  otherDestinationName: string
}

interface ActivationDialogProps {
  destinationName: string
  conflicts: ActivationConflictChoice[]
  /** Candidate habits that are not in conflict and will start regardless. */
  remainingCount: number
  onConfirm: (decisions: ActivationDecision[]) => void
  onCancel: () => void
}

/**
 * Small, accessible confirmation for starting a plan whose swaps are already
 * funding another plan. Each conflict offers a transfer or a keep-with-other
 * choice; the default is the non-destructive "keep" so nothing is moved unless
 * the user explicitly asks for it. Nothing is removed silently.
 */
export function ActivationDialog({
  destinationName,
  conflicts,
  remainingCount,
  onConfirm,
  onCancel,
}: ActivationDialogProps) {
  const { copy } = useI18n()
  const titleId = useId()
  const [choices, setChoices] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(conflicts.map((conflict) => [conflict.habitId, false])),
  )
  const firstActionRef = useRef<HTMLButtonElement | null>(null)
  const allKept = conflicts.every((conflict) => !(choices[conflict.habitId] ?? false))
  const wouldStartEmpty = remainingCount === 0 && allKept

  useEffect(() => {
    firstActionRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])

  function messageFor(conflict: ActivationConflictChoice): string {
    if (conflict.kind === 'one-time-credited') {
      return copy.plan.activation.oneTimeUsed
    }
    if (conflict.kind === 'same-group') {
      return copy.plan.activation.sameGroup(conflict.otherDestinationName)
    }
    return copy.plan.activation.alreadyFunding(conflict.otherDestinationName)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg border border-line bg-canvas sm:border-t-0"
      >
        <div className="border-b border-line p-5">
          <p className="label-accent">{destinationName}</p>
          <h2 id={titleId} className="mt-1.5 text-[clamp(1.8rem,4vw,2.6rem)] leading-[0.9] text-ink">
            {copy.plan.activation.title}
          </h2>
          <p className="mt-3 max-w-md text-[12px] leading-relaxed text-muted">
            {copy.plan.activation.body}
          </p>
        </div>

        <div className="grid gap-5 border-b border-line p-5">
          {conflicts.map((conflict) => {
            const transfer = choices[conflict.habitId] ?? false
            return (
              <div key={conflict.habitId} className="border-l-2 border-accent pl-3">
                <p className="text-[13px] font-semibold text-ink">{conflict.habitTitle}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                  {messageFor(conflict)}
                </p>
                <div
                  role="group"
                  aria-label={conflict.habitTitle}
                  className="mt-2 flex flex-wrap gap-2"
                >
                  {conflict.kind !== 'one-time-credited' && (
                    <button
                      type="button"
                      ref={conflict.habitId === conflicts[0].habitId ? firstActionRef : undefined}
                      aria-pressed={transfer}
                      onClick={() =>
                        setChoices((current) => ({
                          ...current,
                          [conflict.habitId]: true,
                        }))
                      }
                      className={cn(
                        'border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors',
                        transfer
                          ? 'border-ink bg-ink text-canvas'
                          : 'border-line text-ink hover:border-ink',
                      )}
                    >
                      {copy.plan.activation.transfer}
                    </button>
                  )}
                  <button
                    type="button"
                    ref={
                      conflict.kind === 'one-time-credited' &&
                      conflict.habitId === conflicts[0].habitId
                        ? firstActionRef
                        : undefined
                    }
                    aria-pressed={!transfer}
                    onClick={() =>
                      setChoices((current) => ({
                        ...current,
                        [conflict.habitId]: false,
                      }))
                    }
                    className={cn(
                      'border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors',
                      !transfer
                        ? 'border-ink bg-ink text-canvas'
                        : 'border-line text-ink hover:border-ink',
                    )}
                  >
                    {copy.plan.activation.keepOther}
                  </button>
                </div>
              </div>
            )
          })}
          <p className="text-[10px] leading-relaxed text-muted">
            {copy.plan.activation.transferNote}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 p-5">
          {wouldStartEmpty && (
            <p className="mr-auto text-[10px] leading-relaxed text-accent-dark">
              {copy.plan.activation.emptySelection}
            </p>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
          >
            {copy.plan.activation.cancel}
          </button>
          <button
            type="button"
            onClick={() =>
              onConfirm(
                conflicts.map((conflict) => ({
                  habitId: conflict.habitId,
                  transfer: choices[conflict.habitId] ?? false,
                })),
              )
            }
            disabled={wouldStartEmpty}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copy.plan.activation.confirm}
          </button>
        </div>
      </div>
    </div>
  )
}
