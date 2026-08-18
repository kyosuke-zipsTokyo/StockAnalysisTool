import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatJpy(value: number) {
  return `¥${Math.round(value).toLocaleString('ja-JP')}`
}

export function formatPct(value: number, digits = 1) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(digits)}%`
}

export function formatOku(value: number) {
  return `${value.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}億円`
}
