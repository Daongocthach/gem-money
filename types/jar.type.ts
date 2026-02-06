import { SyncStatus } from "./common.type"


export type Jar = {
  id: string
  name: string
  percentage: number
  current_balance: number
  target_balance: number
  color: string
  icon: string
  is_active: number
  sync_status: SyncStatus
  updated_at: number
}