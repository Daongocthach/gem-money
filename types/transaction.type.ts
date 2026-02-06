
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER'

export interface TransactionFormValues {
  amount: string; // Dùng string để TextInput xử lý format dấu chấm mượt hơn
  note: string;
  date: Date;
  // Các trường ẩn hoặc truyền từ props
  jar_id?: string; 
}

// Nếu bạn cần định nghĩa object Transaction lưu trong Database
export interface Transaction {
  id: string;
  jar_id: string;
  amount: number; // Trong DB lưu là số thực (REAL)
  note: string | null;
  date: number;   // Lưu dưới dạng timestamp (INTEGER)
  is_deleted: number; // 0 hoặc 1
  sync_status: 'pending' | 'synced';
  updated_at: number;
}