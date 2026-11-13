import { ArrowRight } from 'lucide-react'
import { cn } from '../lib/cn'
import { formatMonths } from '../lib/format'

export interface PresetView {
  id: string
  label: string
  description: string
  habitIds: string[]
  months: number | null
}

interface PresetButtonsProps {
  presets: PresetView[]
  activeIds: string[]
  onApply: (habitIds: string[]) => void
}

export function PresetButtons({ presets, activeIds, onApply }: PresetButtonsProps) {
  const activeKey = [...activeIds].sort().join('|')

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">Começar com um plano</p>
        <p className="text-[11px] text-muted">Podes ajustar tudo depois</p>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {presets.map((preset) => {
          const isActive = [...preset.habitIds].sort().join('|') === activeKey
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApply(preset.habitIds)}
              className={cn(
                'group flex flex-col items-start border p-3.5 text-left transition-colors',
                isActive
                  ? 'border-clay bg-clay-soft/60'
                  : 'border-line bg-transparent hover:border-ink/40 hover:bg-white/60',
              )}
            >
              <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                <ArrowRight className="h-3.5 w-3.5 text-clay" aria-hidden="true" />
                {preset.label}
              </span>
              <span className="mt-1 text-[11px] leading-relaxed text-muted">
                {preset.description}
              </span>
              <span className="nums mt-2 text-[13px] text-ink">
                {preset.months !== null ? `≈ ${formatMonths(preset.months)}` : 'fora de alcance'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
