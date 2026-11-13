import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import type { HabitCategory } from '../types'
import { useI18n } from '../i18n/context'
import { HABIT_CATEGORY_META } from '../lib/habitCategories'
import { cn } from '../lib/cn'

interface HabitCategorySectionProps {
  category: HabitCategory
  available: number
  selected: number
  children: ReactNode
  className?: string
}

export function HabitCategorySection({
  category,
  available,
  selected,
  children,
  className,
}: HabitCategorySectionProps) {
  const { copy } = useI18n()
  const [open, setOpen] = useState(true)
  const meta = HABIT_CATEGORY_META[category]
  const Icon = meta.icon
  const panelId = `cat-${category}-panel`

  return (
    <section className={className}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            'flex w-full items-center gap-3 border-b-2 pb-3 text-left transition-colors',
            meta.border,
          )}
        >
          <span
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center',
              meta.soft,
              meta.color,
            )}
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" strokeWidth={2.15} />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block font-display text-[21px] font-semibold uppercase leading-none text-ink">
              {copy.habitCategories[category]}
            </span>
            <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
              {copy.habitSelector.summary(available, selected)}
            </span>
          </span>

          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-muted transition-transform duration-200',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </button>
      </h3>

      <div id={panelId} hidden={!open}>
        {children}
      </div>
    </section>
  )
}
