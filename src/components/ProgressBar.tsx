import { cn } from '../lib/cn'

interface ProgressBarProps {
  /** Progress from 0 to 1. */
  value: number
  label?: string
  className?: string
}

/**
 * Thin, sharp 2px progress rail. The width transition is subtle and, like every
 * transition in the app, is collapsed to near-zero under `prefers-reduced-motion`
 * by the global stylesheet.
 */
export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value))
  const percent = Math.round(clamped * 100)

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-[2px] w-full bg-line', className)}
    >
      <div
        className="h-full bg-accent transition-[width] duration-700 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
