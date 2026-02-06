import { router } from "expo-router"
import { icons } from "lucide-react-native"
import React from "react"

export type ApiResponse<T> = {
  data: T
  message: string
  status: boolean
}

export type DropdownProps = {
  label: string
  value: string | number
}

export type PaginatedResponse<T> = {
  status: boolean
  data: T
  pagination: {
    total_items: number
    page_size: number
    current_page: number
    total_pages: number
    next_page: string | null
    previous_page: string | null
  }
}

export type Route = {
  key: string
  title: string
  count?: string
}

export type DrawerItemProps = {
  name: string,
  title: string,
  icon: keyof typeof icons,
  path: typeof router.push extends (path: infer P) => any ? P : never,
  isAccess?: boolean,
}

export type StatusConfig = {
  value: string | number
  label: string
  color: string
  containerColor: string
}

export type StatusConfigMap = Record<string, StatusConfig>

export type FileItem = {
  id: number
  name: string
  file: string
  file_local: string
  created: string
  modified: string
  note: string
}

export type FileProps = {
  uri: string
  name: string
  type: string
}

export type LocalizedText = {
  en: string
  vi: string
  'zh-CN': string
  'zh-TW': string
}


export type LanguageProps = 'en' | 'vi' | 'zh-TW' | 'zh-CN'

export type ConfirmState = 'rejected' | 'neutral' | 'confirmed'

export type TableColumn<T = any> = {
  key: keyof T | string
  label: string
  minWidth?: number
  maxWidth?: number
  align?: 'flex-start' | 'center' | 'flex-end'
  numberOfLines?: number
  render?: (value: any, row: T) => React.ReactNode
}


export type SyncStatus = 'pending' | 'synced' | 'error'
