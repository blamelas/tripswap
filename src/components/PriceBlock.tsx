import { useI18n } from '../i18n/context'
import { cn } from '../lib/cn'

type PriceSize = 'sm' | 'md' | 'lg'
type PriceTone = 'light' | 'dark'

interface PriceBlockProps {
  budget: number
  size?: PriceSize
  tone?: PriceTone
  className?: string
}

const SIZES: Record<PriceSize, { zero: string; budget: string; label: string }> = {
  sm: {
    zero: 'text-[2.35rem]',
    budget: 'text-[12px]',
    label: 'text-[8px]',
  },
  md: {
    zero: 'text-[3.8rem]',
    budget: 'text-[13px]',
    label: 'text-[9px]',
  },
  lg: {
    zero: 'text-[clamp(4rem,7.5vw,6.6rem)]',
    budget: 'text-[16px]',
    label: 'text-[10px]',
  },
}

export function PriceBlock({
  budget,
  size = 'md',
  tone = 'light',
  className,
}: PriceBlockProps) {
  const { copy, fmt } = useI18n()
  const s = SIZES[size]
  const muted = tone === 'dark' ? 'text-canvas/70' : 'text-muted'
  const decorated = tone === 'dark' ? 'decoration-canvas/40' : 'decoration-muted/60'

  return (
    <div className={cn('leading-none', className)}>
      <p className={cn('font-semibold uppercase tracking-[0.18em]', s.label, muted)}>
        {copy.price.planningTarget}
      </p>
      <div className="mt-1 flex items-end gap-3">
        <span className={cn('nums font-medium line-through decoration-1', s.budget, muted, decorated)}>
          {fmt.eur(budget, { whole: true })}
        </span>
        <span className={cn('font-display font-semibold text-accent', s.zero)}>
          €0<span className="align-top text-[0.42em]">*</span>
        </span>
      </div>
      <p className={cn('mt-1.5 font-semibold uppercase tracking-[0.14em]', s.label, muted)}>
        {copy.price.fundedBySwaps}
      </p>
    </div>
  )
}
