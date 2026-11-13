import { cn } from '../lib/cn'

interface ProgressRailProps {
  progress: number
  unlocked: boolean
  className?: string
  label?: string
}

export function ProgressRail({ progress, unlocked, className, label }: ProgressRailProps) {
  const percent = Math.round(Math.min(1, Math.max(0, progress)) * 100)

  return (
    <div className={className}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={label ?? 'Progresso para o objetivo'}
        className="relative h-[6px] w-full bg-line"
      >
        <div
          className={cn(
            'absolute inset-y-0 left-0 transition-[width] duration-700 ease-out',
            unlocked ? 'bg-clay' : 'bg-ink',
          )}
          style={{ width: `${percent}%` }}
        />
        <span
          className={cn(
            'absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper transition-[left] duration-700 ease-out',
            unlocked ? 'bg-clay' : 'bg-ink',
          )}
          style={{ left: `${percent}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
