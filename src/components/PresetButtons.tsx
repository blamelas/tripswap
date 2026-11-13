import { useI18n } from '../i18n/context'
import { cn } from '../lib/cn'

export interface PresetView {
  id: 'essential' | 'balanced' | 'conscious'
  habitIds: string[]
  months: number | null
}

interface PresetButtonsProps {
  presets: PresetView[]
  activeIds: string[]
  onApply: (habitIds: string[]) => void
}

export function PresetButtons({ presets, activeIds, onApply }: PresetButtonsProps) {
  const { copy, fmt } = useI18n()
  const activeKey = [...activeIds].sort().join('|')

  return (
    <div>
      <div className="flex items-end justify-between gap-4 border-b border-line pb-2">
        <p className="label-accent">{copy.detail.presetsEyebrow}</p>
        <p className="text-[9px] uppercase tracking-[0.14em] text-muted">
          {copy.detail.presetsHint}
        </p>
      </div>

      <div className="grid border-b border-line sm:grid-cols-3">
        {presets.map((preset, index) => {
          const isActive = [...preset.habitIds].sort().join('|') === activeKey
          const presetCopy = copy.presets[preset.id]

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApply(preset.habitIds)}
              className={cn(
                'border-b border-line py-4 text-left transition-colors sm:border-b-0 sm:border-r sm:px-4 sm:last:border-r-0',
                index === 0 && 'sm:pl-0',
                isActive ? 'bg-ink text-canvas' : 'hover:bg-sky/35',
              )}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-display text-xl font-semibold uppercase leading-none">
                  {presetCopy.label}
                </span>
                <span
                  className={cn(
                    'nums text-[12px]',
                    isActive ? 'text-accent' : 'text-ink',
                  )}
                >
                  {preset.months !== null
                    ? `≈ ${fmt.months(preset.months)}`
                    : copy.preset.outOfReach}
                </span>
              </span>
              <span
                className={cn(
                  'mt-1 block text-[9px] font-semibold uppercase tracking-[0.12em]',
                  isActive ? 'text-canvas/65' : 'text-muted',
                )}
              >
                {presetCopy.description}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
