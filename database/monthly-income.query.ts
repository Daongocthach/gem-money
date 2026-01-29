import { SQLiteDatabase } from "expo-sqlite"

export const MonthlyIncomesQuery = {
  getAll: async (db: SQLiteDatabase) => {
    return await db.getAllAsync('SELECT * FROM monthly_incomes WHERE is_deleted = 0 ORDER BY date DESC')
  },

  create: async (db: SQLiteDatabase, income: { id: string, amount: number, note: string }) => {
    const now = Date.now()
    return await db.runAsync(
      'INSERT INTO monthly_incomes (id, amount, date, note, updated_at) VALUES (?, ?, ?, ?, ?)',
      [income.id, income.amount, now, income.note, now]
    )
  },

  delete: async (db: SQLiteDatabase, id: string) => {
    return await db.runAsync(
      'UPDATE monthly_incomes SET is_deleted = 1, updated_at = ? WHERE id = ?',
      [Date.now(), id]
    )
  }
}