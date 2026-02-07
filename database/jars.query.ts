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
    return await db.runAsync(
      'UPDATE jars SET target_balance = ? * (percentage / 100.0), updated_at = ?',
      [totalTarget, Date.now()]
    )
  },

  getSpendingPieData: async (db: SQLiteDatabase) => {
    return await db.getAllAsync<{
      value: number,
      text: string,
      color: string
    }>(
      `SELECT 
          COALESCE(SUM(t.amount), 0) as value, 
          j.name as text, 
          j.color as color
      FROM jars j
      LEFT JOIN transactions t ON j.id = t.jar_id AND t.is_deleted = 0
      GROUP BY j.id`
    )
  },
}