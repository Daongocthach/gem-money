import { Transaction } from "@/types"; // Đảm bảo type Transaction khớp với schema
import { SQLiteDatabase } from "expo-sqlite";

export const TransactionsQuery = {
  /**
   * 1. Lấy tất cả giao dịch (không phân trang)
   */
  getAll: async (db: SQLiteDatabase) => {
    return await db.getAllAsync<Transaction>(
      'SELECT * FROM transactions WHERE is_deleted = 0 ORDER BY date DESC'
    );
  },

  /**
   * 2. Lấy giao dịch phân trang kèm lọc theo ngày và theo hũ
   */
  getAllPaginated: async (
    db: SQLiteDatabase,
    { page, pageSize, dateFilter, jarId }: { 
      page: number; 
      pageSize: number; 
      dateFilter?: string; 
      jarId?: string 
    }
  ) => {
    const offset = (page - 1) * pageSize;
    let query = `SELECT * FROM transactions WHERE is_deleted = 0`;
    const params: any[] = [];

    if (dateFilter) {
      // Lọc các giao dịch từ ngày được chọn trở về trước
      query += ` AND strftime('%Y-%m-%d', date / 1000, 'unixepoch') <= ?`;
      params.push(dateFilter);
    }

    if (jarId) {
      query += ` AND jar_id = ?`;
      params.push(jarId);
    }

    query += ` ORDER BY date DESC LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    return await db.getAllAsync<Transaction>(query, params);
  },

  /**
   * 3. Lấy chi tiết một giao dịch theo ID
   */
  getById: async (db: SQLiteDatabase, id: string) => {
    return await db.getFirstAsync<Transaction>(
      'SELECT * FROM transactions WHERE id = ? AND is_deleted = 0',
      [id]
    );
  },

  /**
   * 4. Tạo mới một giao dịch chi tiêu
   * Cập nhật current_balance của hũ (+ amount)
   */
  create: async (
    db: SQLiteDatabase,
    tx: { id: string; jar_id: string; amount: number; note: string; date: Date }
  ) => {
    const now = Date.now();
    const recordDate = tx.date.getTime();

    return await db.withTransactionAsync(async () => {
      // Chèn giao dịch
      await db.runAsync(
        `INSERT INTO transactions (id, jar_id, amount, note, date, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [tx.id, tx.jar_id, tx.amount, tx.note, recordDate, now]
      );

      // Cập nhật số dư đã chi (current_balance) trong hũ
      await db.runAsync(
        `UPDATE jars SET current_balance = current_balance + ?, updated_at = ? WHERE id = ?`,
        [tx.amount, now, tx.jar_id]
      );
    });
  },

  /**
   * 5. Cập nhật giao dịch
   * Xử lý trường hợp thay đổi số tiền hoặc đổi hũ chi tiêu
   */
  update: async (db: SQLiteDatabase, tx: Transaction) => {
    const now = Date.now();
    const oldTx = await TransactionsQuery.getById(db, tx.id);
    if (!oldTx) throw new Error("Transaction not found");

    return await db.withTransactionAsync(async () => {
      // 1. Hoàn tác số tiền cũ ở hũ cũ
      await db.runAsync(
        `UPDATE jars SET current_balance = current_balance - ?, updated_at = ? WHERE id = ?`,
        [oldTx.amount, now, oldTx.jar_id]
      );

      // 2. Cập nhật thông tin giao dịch mới
      await db.runAsync(
        `UPDATE transactions SET jar_id = ?, amount = ?, note = ?, date = ?, updated_at = ? 
         WHERE id = ?`,
        [tx.jar_id, tx.amount, tx.note, tx.date, now, tx.id]
      );

      // 3. Cập nhật số tiền mới vào hũ mới (hoặc hũ hiện tại)
      await db.runAsync(
        `UPDATE jars SET current_balance = current_balance + ?, updated_at = ? WHERE id = ?`,
        [tx.amount, now, tx.jar_id]
      );
    });
  },

  /**
   * 6. Xóa giao dịch (Soft Delete)
   * Trừ số tiền đã chi ra khỏi current_balance của hũ
   */
  delete: async (db: SQLiteDatabase, id: string) => {
    const now = Date.now();
    const tx = await TransactionsQuery.getById(db, id);
    if (!tx) return;

    return await db.withTransactionAsync(async () => {
      // Đánh dấu xóa giao dịch
      await db.runAsync(
        'UPDATE transactions SET is_deleted = 1, updated_at = ? WHERE id = ?',
        [now, id]
      );

      // Trừ số tiền đã xóa khỏi số dư đã chi của hũ
      await db.runAsync(
        'UPDATE jars SET current_balance = current_balance - ?, updated_at = ? WHERE id = ?',
        [tx.amount, now, tx.jar_id]
      );
    });
  }
};