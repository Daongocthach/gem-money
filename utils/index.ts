import { STORE_NAME } from '@/constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const getShortName = (fullName: string | undefined) => {
  if (!fullName) return "??"
  if (fullName.length < 3) return fullName.toUpperCase()
  const nameParts = fullName.split(" ")

  const firstInitial = nameParts[0].charAt(0).toUpperCase()
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase()

  return (firstInitial + lastInitial).toUpperCase()
}

export const getCurrentLanguage = async (): Promise<string | null> => {
  try {
    const rawState = await AsyncStorage.getItem(STORE_NAME)
    if (!rawState) return null

    const parsedState = JSON.parse(rawState)
    return parsedState?.state?.currentLanguage ?? null
  } catch (error) {
    return null
  }
}

export function cleanParams<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {}

  for (const key in obj) {
    const value = obj[key]

    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "number" && Number.isNaN(value))
    ) {
      continue
    }

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        if (value.length === 0) continue
        result[key] = value
        continue
      }

      if (Object.keys(value).length === 0) continue
    }

    result[key] = value
  }

  return result
}

export const arrayParamsSerializer = (params: { [x: string]: any, hasOwnProperty: (arg0: string) => any }) => {
  const parts = []

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key]
      if (value === undefined || (Array.isArray(value) && value.length === 0)) {
        continue
      }

      if (Array.isArray(value)) {
        parts.push(`${key}=${value.join(',')}`)
      } else {
        parts.push(`${key}=${encodeURIComponent(value)}`)
      }
    }
  }

  return parts.join('&')
}

// Ví dụ: 100000 -> 100.000 ₫
export const formatCurrency = (amount: number | string | undefined | null): string => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0)
}

/**
 * Ví dụ: 100000 -> 100.000
 */
export const formatNumber = (amount: number | string | undefined | null): string => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('vi-VN').format(value || 0)
}

// Ví dụ: 1000000 -> 1.000k, 830000 -> 830k, 83500 -> 83.5k
export const formatK = (amount: number | string | undefined | null): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (num === null || num === undefined || isNaN(num as number)) return '0k'

  const kValue = (num as number) / 1000

  const roundedValue = Number.isInteger(kValue) 
    ? kValue 
    : Math.round(kValue * 10) / 10

  const formatted = roundedValue.toLocaleString('de-DE') 

  return `${formatted}k`
}

export const formatNumberWithDots = (value: string | number) => {
  if (!value && value !== 0) return ''
  const numberString = value.toString().replace(/\D/g, '')
  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const parseDotsToNumber = (value: string) => {
  return value.replace(/\./g, '')
}