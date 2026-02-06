import { SyncStatus } from "./common.type"

export type Income = {
    id: string
    amount: number
    date: number
    note: string
    is_deleted: number
    sync_status: SyncStatus
    updated_at: number
} 

export interface IncomeSection {
  title: string
  data: Income[]
}

export type IncomeFormValues = {
  amount: string
  note: string
  date: Date
}