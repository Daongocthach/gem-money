import { STORE_NAME } from '@/constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { addMinutes, parse, setMilliseconds, setSeconds } from 'date-fns'
import { FileProps } from '../types'

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

export const getAppStateValue = async <T = any>(key: string): Promise<T | null> => {
  try {
    const rawState = await AsyncStorage.getItem(STORE_NAME)
    if (!rawState) return null

    const parsedState = JSON.parse(rawState)
    return parsedState?.state?.[key] ?? null
  } catch (error) {
    console.error(`Error getting state.${key} from storage:`, error)
    return null
  }
}

export const setAppStateValue = async <T = any>(key: string, value: T): Promise<void> => {
  try {
    const rawState = await AsyncStorage.getItem(STORE_NAME)
    const parsed = rawState ? JSON.parse(rawState) : {}

    const updatedState = {
      ...parsed,
      state: {
        ...(parsed.state || {}),
        [key]: value,
      },
    }

    await AsyncStorage.setItem(STORE_NAME, JSON.stringify(updatedState))
  } catch (error) {
    console.error(`Error setting state.${key} in storage:`, error)
  }
}

export function formatPathToTitle(path: string): string {
  if (!path) return ''
  const lastPart = path.split('/').filter(Boolean).pop() || ''
  return lastPart
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function parseTime(timeStr: string): Date {
  return parse(timeStr, 'HH:mm:ss', new Date())
}

export const getFileExtension = (file: string) => {
  const parts = file.split(".")
  const extension = parts.length > 1 ? parts.pop() : null

  if (!extension) return "unknown"

  if (["jpg", "jpeg", "png", "gif", "svg"].includes(extension)) return "image"

  if (
    ![
      "doc",
      "docx",
      "json",
      "pdf",
      "ppt",
      "pptx",
      "rar",
      "txt",
      "xls",
      "xlsx",
      "zip",
      "mp3",
      "mp4",
    ].includes(extension)
  )
    return "unknown"

  switch (extension) {
    case "xlsx":
      return "xls"

    case "pptx":
      return "ppt"

    case "docx":
      return "doc"

    case "rar":
      return "zip"

    default:
      return extension
  }
}


export const getNormalizedName = (name: string) => {
  const map = {
    à: "a",
    á: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ă: "a",
    ằ: "a",
    ắ: "a",
    ẳ: "a",
    ẵ: "a",
    ặ: "a",
    â: "a",
    ầ: "a",
    ấ: "a",
    ẩ: "a",
    ẫ: "a",
    ậ: "a",
    è: "e",
    é: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ề: "e",
    ế: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    ì: "i",
    í: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ò: "o",
    ó: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ô: "o",
    ồ: "o",
    ố: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ờ: "o",
    ớ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    ù: "u",
    ú: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ừ: "u",
    ứ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    ỳ: "y",
    ý: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
    đ: "d",
  } as { [key: string]: string }

  return name.toLowerCase().replace(/[^\w\s]/g, (a: string) => map[a] || a)
}

export function cleanBarcode(code: string) {
  return code
    .replace(/\u001d/g, '')    // GS
    .replace(/\u0000/g, '')
    .replace(/[\r\n\t]/g, '')
    .trim()
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

export const roundUpTo15Minutes = (date: Date) => {
  const d = new Date(date)
  const minutes = d.getMinutes()
  const remainder = minutes % 15
  const diff = remainder === 0 ? 0 : 15 - remainder

  return setMilliseconds(
    setSeconds(addMinutes(d, diff), 0),
    0
  )
}


export function parseFileFromUrl(url?: string): FileProps | undefined {
  if (!url) return undefined

  try {
    const cleanUrl = url.split('?')[0]
    const filename = cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1)

    const ext = filename.split('.').pop()?.toLowerCase()

    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      heic: 'image/heic',
      heif: 'image/heif',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }

    const mimeType = ext ? mimeMap[ext] : undefined

    if (!mimeType) {
      throw new Error(`Unsupported file type: ${ext}`)
    }

    return {
      uri: url,
      name: filename,
      type: mimeType,
    }
  } catch (err) {
    console.warn('parseFileFromUrl failed:', err)
    return undefined
  }
}

const getConvertedDate = (date: string) => {
  return new Date(new Date(date).setHours(0, 0, 0));
}

export const getDisabledDate =
  ({
    dateEnd,
    dateStart,
    limitDateStart,
    limitDateEnd,
  }: {
    dateEnd?: Date
    dateStart?: Date
    limitDateStart?: string | null
    limitDateEnd?: string | null
  }) =>
    (date: Date) => {
      if (limitDateStart && date < getConvertedDate(limitDateStart)) return true
      if (limitDateEnd && date > getConvertedDate(limitDateEnd)) return true

      if (dateStart && date < new Date(dateStart.setHours(0, 0, 0))) return true
      if (dateEnd && date > new Date(dateEnd.setHours(23, 59, 59))) return true

      return false
    }

export function enumToLabel(value?: string) {
  if (!value) return ''
  return value.toLowerCase().replace(/_/g, ' ')
}


export const normalizeText = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()