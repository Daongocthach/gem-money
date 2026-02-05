import { SQLiteDatabase } from "expo-sqlite";
import { JarsQuery } from "./jars.query";

export const TransactionsQuery = {
  getAll: async (db: SQLiteDatabase) => {
    return await db.getAllAsync('SELECT * FROM transactions WHERE is_deleted = 0 ORDER BY date DESC');
  },

  create: async (db: SQLiteDatabase, trans: {
    id: string, jar_id: string, amount: number, note: string, type: 'EXPENSE' | 'INCOME' | 'TRANSFER', target_jar_id?: string
  }) => {
    const now = Date.now();
    
    // Sử dụng transaction của SQLite để đảm bảo toàn vẹn dữ liệu
    await db.withTransactionAsync(async () => {
      // 1. Chèn bản ghi giao dịch
      await db.runAsync(
        `INSERT INTO transactions (id, jar_id, target_jar_id, amount, note, date, type, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [trans.id, trans.jar_id, trans.target_jar_id || null, trans.amount, trans.note, now, trans.type, now]
      );

      // 2. Cập nhật số dư trong hũ tương ứng
      if (trans.type === 'EXPENSE') {
        await JarsQuery.updateBalance(db, trans.jar_id, -trans.amount);
      } else if (trans.type === 'INCOME') {
        await JarsQuery.updateBalance(db, trans.jar_id, trans.amount);
      } else if (trans.type === 'TRANSFER' && trans.target_jar_id) {
        // Chuyển tiền: Trừ hũ A, cộng hũ B
        await JarsQuery.updateBalance(db, trans.jar_id, -trans.amount);
        await JarsQuery.updateBalance(db, trans.target_jar_id, trans.amount);
      }
    });
  },

  delete: async (db: SQLiteDatabase, id: string) => {
    // Xóa mềm và hoàn lại tiền vào hũ (Logic ngược lại với Create)
    const trans = await db.getFirstAsync<any>('SELECT * FROM transactions WHERE id = ?', [id]);
    if (!trans) return;

    await db.withTransactionAsync(async () => {
      await db.runAsync('UPDATE transactions SET is_deleted = 1, updated_at = ? WHERE id = ?', [Date.now(), id]);
      
      if (trans.type === 'EXPENSE') {
        await JarsQuery.updateBalance(db, trans.jar_id, trans.amount);
      } else if (trans.type === 'INCOME') {
        await JarsQuery.updateBalance(db, trans.jar_id, -trans.amount);
      }
      // Lưu ý: Logic Transfer xóa sẽ phức tạp hơn chút, cần xử lý cả 2 hũ.
    });
  }
};