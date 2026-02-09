import { DropdownProps } from "../types"

export const LANGUAGE_OPTIONS: DropdownProps[] = [
  { label: 'english', value: 'enUS' },
  { label: 'vietnamese', value: 'vi' },
  { label: 'taiwanese', value: 'zhTW' },
  { label: 'chinese', value: 'zhCN' },
]

export const PAGE_SIZE = 10
export const IPAD = 768
export const TABLET = 1024

export const DETERMINATION = {
  LEADER_APPROVED: 1,
  LEADER_REJECTED: 2,
  APPROVED: 3,
  REJECTED: 4,
}