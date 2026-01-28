import { LanguageProps } from "../types"

export const WEEKDAYS: Record<LanguageProps, string[]> = {
  vi: ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  "zh-CN": ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  "zh-TW": ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
}


export const MONTHS: Record<LanguageProps, string[]> = {
  vi: [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ],
  en: [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ],
  "zh-CN": [
    "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"
  ],
  "zh-TW": [
    "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"
  ],
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