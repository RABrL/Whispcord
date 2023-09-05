import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isMacOs() {
  if (typeof window !== 'undefined')
    return window.navigator.userAgent.includes('Mac')
}

export const getInitials = (name: string) => {
  const words = name.split(' ')
  return words.length > 1
    ? words[0][0] + words[1][0]
    : words[0][0] + words[0][1]
}
