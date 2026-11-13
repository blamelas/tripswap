import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import { cn } from '../lib/cn'

interface NumberTickerProps {
  value: number
  format?: (value: number) => string
  className?: string
}

export function NumberTicker({ value, format, className }: NumberTickerProps) {
  const display = useAnimatedNumber(value)
  return (
    <span className={cn('nums', className)}>
      {format ? format(display) : Math.round(display).toLocaleString('pt-PT')}
    </span>
  )
}
