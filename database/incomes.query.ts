import { Income } from "@/types/income.type"
import { SQLiteDatabase } from "expo-sqlite"

const syncJarsTargetBalance = async (db: SQLiteDatabase) => {
  // 1. Tính tổng thu nhập hiện có (không bao gồm các mục đã xóa)
  const totalResult = await db.getFirstAsync<{ total: number }>(
    'SELECT SUM(amount) as total FROM incomes WHERE is_deleted = 0'
  )
  const totalIncome = totalResult?.total ?? 0

  // 2. Cập nhật target_balance cho từng hũ dựa theo percentage
  // Công thức: target_balance = tổng thu nhập * (phần trăm hũ / 100)
  await db.execAsync(`
    UPDATE jars 
    SET target_balance = (percentage / 100.0) * ${totalIncome},
        updated_at = ${Date.now()}
  `)
}

export const IncomesQuery = {
  getAll: async (db: SQLiteDatabase, page: number = 0, pageSize: number = 20) => {
    const offset = page * pageSize
    return await db.getAllAsync<Income>(
      `SELECT * FROM incomes 
       WHERE is_deleted = 0 
       ORDER BY date DESC 
       LIMIT ? OFFSET ?`,
      [pageSize, offset]
    )
  },

  getAllPaginated: async (
    db: SQLiteDatabase,
    { page, pageSize, dateFilter }: { page: number, pageSize: number, dateFilter?: string }
  ) => {
    const offset = (page - 1) * pageSize

    let query = `SELECT * FROM incomes WHERE is_deleted = 0`
    const params: any[] = []

    if (dateFilter) {
      query += ` AND strftime('%Y-%m-%d', date / 1000, 'unixepoch') <= ?`
      params.push(dateFilter)
    }

    query += ` ORDER BY date DESC LIMIT ? OFFSET ?`
    params.push(pageSize, offset)

    return await db.getAllAsync<Income>(query, params)
  },

  getTotalAmount: async (
    db: SQLiteDatabase,
    dateFilter?: string
  ): Promise<number> => {
    let query = `SELECT SUM(amount) as total FROM incomes WHERE is_deleted = 0`
    const params: any[] = []

    if (dateFilter) {
      query += ` AND strftime('%Y-%m-%d', date / 1000, 'unixepoch') <= ?`
      params.push(dateFilter)
    }

    const result = await db.getFirstAsync<{ total: number }>(query, params)

    return result?.total ?? 0
  },

  create: async (
    db: SQLiteDatabase,
    income: { id: string, amount: number, note: string, date: Date }
  ) => {
    const now = Date.now()
    const recordDate = income.date.getTime()

    return await db.withTransactionAsync(async () => {
      // Thêm thu nhập mới
      await db.runAsync(
        'INSERT INTO incomes (id, amount, date, note, updated_at) VALUES (?, ?, ?, ?, ?)',
        [income.id, income.amount, recordDate, income.note, now]
      )

      // Cập nhật lại mục tiêu của các hũ
      await syncJarsTargetBalance(db)
    })
  },

  update: async (db: SQLiteDatabase, income: Income) => {
    const now = Date.now()
    
    return await db.withTransactionAsync(async () => {
      // Cập nhật thông tin thu nhập
      await db.runAsync(
        'UPDATE incomes SET amount = ?, note = ?, updated_at = ? WHERE id = ?',
        [income.amount, income.note, now, income.id]
      )

      // Tính toán lại các hũ vì 'amount' có thể đã thay đổi
      await syncJarsTargetBalance(db)
    })
  },

  delete: async (db: SQLiteDatabase, id: string) => {
    const now = Date.now()

    return await db.withTransactionAsync(async () => {
      // Đánh dấu xóa thu nhập
      await db.runAsync(
        'UPDATE incomes SET is_deleted = 1, updated_at = ? WHERE id = ?',
        [now, id]
      )

      // Tính toán lại các hũ (tổng thu nhập sẽ giảm xuống)
      await syncJarsTargetBalance(db)
    })
  }
}