const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value)
}

export function formatPercent(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(0)}%`
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date)
}

export function formatDateOnly(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

export function getDueLabel(dateString: string) {
  const due = new Date(dateString)
  const now = new Date()
  const ms = due.getTime() - now.getTime()
  const days = Math.round(ms / (24 * 60 * 60 * 1000))

  if (days < 0) return `Overdue by ${Math.abs(days)}d`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  if (days < 7) return `Due in ${days}d`
  return formatDate(due.toISOString())
}

