import { Transaction } from "@/types"
import { SQLiteDatabase } from "expo-sqlite"

export const TransactionsQuery = {
  getAll: async (db: SQLiteDatabase) => {
    return await db.getAllAsync<Transaction>(
      'SELECT * FROM transactions WHERE is_deleted = 0 ORDER BY date DESC'
    )
  },
  getWeeklySpending: async (db: SQLiteDatabase): Promise<number[]> => {
    const rows = await db.getAllAsync<{ day_index: number, total_amount: number }>(
      `SELECT 
        CAST(strftime('%w', date / 1000, 'unixepoch') AS INTEGER) as day_index,
        SUM(amount) as total_amount
      FROM transactions
      WHERE is_deleted = 0 
      AND date >= (strftime('%s', 'now', 'weekday 0', '-7 days') * 1000)
      GROUP BY day_index`
    )

    const values = [0, 0, 0, 0, 0, 0, 0]

    rows.forEach((row) => {
      values[row.day_index] = row.total_amount
    })

    const [sun, ...monToSat] = values
    return [...monToSat, sun]
  },
  getAllPaginated: async (
    db: SQLiteDatabase,
    { page, pageSize, dateFilter, jarId }: {
      page: number
      pageSize: number
      dateFilter?: string
      jarId?: string
    }
  ) => {
    const offset = (page - 1) * pageSize
    let query = `SELECT * FROM transactions WHERE is_deleted = 0`
    const params: any[] = []

    if (dateFilter) {
      query += ` AND strftime('%Y-%m-%d', date / 1000, 'unixepoch') <= ?`
      params.push(dateFilter)
    }

    if (jarId) {
      query += ` AND jar_id = ?`
      params.push(jarId)
    }

    query += ` ORDER BY date DESC LIMIT ? OFFSET ?`
    params.push(pageSize, offset)

    return await db.getAllAsync<Transaction>(query, params)
  },
  getById: async (db: SQLiteDatabase, id: string) => {
    return await db.getFirstAsync<Transaction>(
      'SELECT * FROM transactions WHERE id = ? AND is_deleted = 0',
      [id]
    )
  },
  create: async (
    db: SQLiteDatabase,
    tx: { id: string, jar_id: string, amount: number, note: string, date: Date }
  ) => {
    const now = Date.now()
    const recordDate = tx.date.getTime()

    return await db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO transactions (id, jar_id, amount, note, date, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [tx.id, tx.jar_id, tx.amount, tx.note, recordDate, now]
      )

      await db.runAsync(
        `UPDATE jars SET current_balance = current_balance + ?, updated_at = ? WHERE id = ?`,
        [tx.amount, now, tx.jar_id]
      )
    })
  },
  update: async (db: SQLiteDatabase, tx: Transaction) => {
    const now = Date.now()
    const oldTx = await TransactionsQuery.getById(db, tx.id)
    if (!oldTx) throw new Error("Transaction not found")

    return await db.withTransactionAsync(async () => {
      await db.runAsync(
        `UPDATE jars SET current_balance = current_balance - ?, updated_at = ? WHERE id = ?`,
        [oldTx.amount, now, oldTx.jar_id]
      )

      await db.runAsync(
        `UPDATE transactions SET jar_id = ?, amount = ?, note = ?, date = ?, updated_at = ? 
         WHERE id = ?`,
        [tx.jar_id, tx.amount, tx.note, tx.date, now, tx.id]
      )

      await db.runAsync(
        `UPDATE jars SET current_balance = current_balance + ?, updated_at = ? WHERE id = ?`,
        [tx.amount, now, tx.jar_id]
      )
    })
  },
  delete: async (db: SQLiteDatabase, id: string) => {
    const now = Date.now()
    const tx = await TransactionsQuery.getById(db, id)
    if (!tx) return

    return await db.withTransactionAsync(async () => {
      await db.runAsync(
        'UPDATE transactions SET is_deleted = 1, updated_at = ? WHERE id = ?',
        [now, id]
      )

      await db.runAsync(
        'UPDATE jars SET current_balance = current_balance - ?, updated_at = ? WHERE id = ?',
        [tx.amount, now, tx.jar_id]
      )
    })
  }
}