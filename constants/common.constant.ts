import { LanguageProps } from "../types"

export const WEEKDAYS: Record<LanguageProps, string[]> = {
  vi: ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  "zh-CN": ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  "zh-TW": ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
}

export const PAGE_SIZE = 10
export const IPAD = 768
export const TABLET = 1024

export const DETERMINATION = {
  LEADER_APPROVED: 1,
  LEADER_REJECTED: 2,
  APPROVED: 3,
  REJECTED: 4,
}