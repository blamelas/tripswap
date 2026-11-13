const eur = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

const eurWhole = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const eurCents = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatEUR(
  value: number,
  options?: { whole?: boolean; cents?: boolean },
): string {
  if (options?.cents) return eurCents.format(value)
  if (options?.whole || Number.isInteger(value)) return eurWhole.format(value)
  return eur.format(value)
}

export function formatMonths(months: number | null): string {
  if (months === null) return 'sem prazo estimado'
  return months === 1 ? '1 mês' : `${months} meses`
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
