import { Jar } from '@/types'
import { type SQLiteDatabase } from 'expo-sqlite'

export const JarsQuery = {
  getAll: async (db: SQLiteDatabase): Promise<Jar[]> => {
    return await db.getAllAsync<Jar>(
      'SELECT * FROM jars WHERE is_active = 1 ORDER BY percentage DESC'
    )
  },

  getById: async (db: SQLiteDatabase, id: string): Promise<Jar | null> => {
    return await db.getFirstAsync<Jar>('SELECT * FROM jars WHERE id = ?', [id])
  },

  create: async (db: SQLiteDatabase, jar: { id: string, name: string, percentage: number, color?: string, icon?: string }) => {
    const now = Date.now();
    return await db.runAsync(
      'INSERT INTO jars (id, name, percentage, current_balance, color, icon, is_active, updated_at) VALUES (?, ?, ?, 0, ?, ?, 1, ?)',
      [jar.id, jar.name, jar.percentage, jar.color || '', jar.icon || '', now]
    );
  },

  updateBalance: async (db: SQLiteDatabase, id: string, amount: number) => {
    // Dùng để cộng/trừ tiền trực tiếp vào hũ
    return await db.runAsync(
      'UPDATE jars SET current_balance = current_balance + ?, updated_at = ? WHERE id = ?',
      [amount, Date.now(), id]
    )
  },

  updateJar: async (db: SQLiteDatabase, jar: Partial<Jar> & { id: string }) => {
    return await db.runAsync(
      'UPDATE jars SET name = ?, percentage = ?, color = ?, icon = ?, updated_at = ? WHERE id = ?',
      [jar.name ?? '', jar.percentage ?? 0, jar.color ?? '', jar.icon ?? '', Date.now(), jar.id]
    )
  },

  updateAllTargetBalances: async (db: SQLiteDatabase, totalTarget: number) => {
    // Tính toán target_balance cho từng hũ dựa trên tỷ lệ %
    // target_balance = tổng_mục_tiêu * (phần_trăm / 100)
    return await db.runAsync(
      'UPDATE jars SET target_balance = ? * (percentage / 100.0), updated_at = ?',
      [totalTarget, Date.now()]
    )
  },
}