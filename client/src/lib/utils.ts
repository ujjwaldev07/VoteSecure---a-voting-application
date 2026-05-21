import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat().format(n)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function getPartyColor(party: string): string {
  const colors: Record<string, string> = {
    democrat: '#3b82f6',
    republican: '#ef4444',
    independent: '#8b5cf6',
    green: '#22c55e',
    libertarian: '#f59e0b',
  }
  const key = party.toLowerCase().split(' ')[0] ?? ''
  return colors[key] ?? `hsl(${(party.length * 37) % 360}, 70%, 55%)`
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
