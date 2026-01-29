export type SyncStatus = 'pending' | 'synced' | 'error'
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER'

export type Jar = {
  id: string
  name: string
  percentage: number
  current_balance: number
  color: string
  icon: string
  is_active: number
  sync_status: SyncStatus
  updated_at: number
}

export type Transaction = {
  id: string
  jar_id: string
  target_jar_id?: string
  amount: number
  note: string
  date: number
  type: TransactionType
  is_deleted: number
  sync_status: SyncStatus
  updated_at: number
}

export type MonthlyIncome = {
  id: string
  amount: number
  date: number
  note: string
  is_deleted: number
  sync_status: SyncStatus
  updated_at: number
}