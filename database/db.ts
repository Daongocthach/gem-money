import * as SQLite from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
  const DATABASE_VERSION = 2

  let result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version')
  let currentDbVersion = result?.user_version ?? 0

  console.log("--- DB VERSION HIỆN TẠI:", currentDbVersion);
  console.log("--- MỤC TIÊU LÊN VERSION:", DATABASE_VERSION);

  if (currentDbVersion >= DATABASE_VERSION) return

  if (currentDbVersion === 0) {
    console.log("--- ĐANG KHỞI TẠO DATABASE LẦN ĐẦU...");
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS jars (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        percentage REAL NOT NULL,
        current_balance REAL DEFAULT 0,
        target_balance REAL DEFAULT 0,
        icon TEXT,
        color TEXT,
        is_active INTEGER DEFAULT 1,
        sync_status TEXT DEFAULT 'pending',
        updated_at INTEGER
      );
      CREATE TABLE IF NOT EXISTS monthly_incomes (
        id TEXT PRIMARY KEY NOT NULL,
        amount REAL NOT NULL,
        date INTEGER NOT NULL,
        note TEXT,
        is_deleted INTEGER DEFAULT 0,
        sync_status TEXT DEFAULT 'pending',
        updated_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        jar_id TEXT NOT NULL,
        target_jar_id TEXT,
        amount REAL NOT NULL,
        note TEXT,
        date INTEGER NOT NULL,
        type TEXT DEFAULT 'EXPENSE', -- EXPENSE, INCOME, TRANSFER
        is_deleted INTEGER DEFAULT 0,
        sync_status TEXT DEFAULT 'pending',
        updated_at INTEGER,
        FOREIGN KEY (jar_id) REFERENCES jars (id)
      );
    `);

    const defaultJars = [
      ['1', 'essential', 55],
      ['2', 'savings', 10],
      ['3', 'education', 10],
      ['4', 'enjoyment', 10],
      ['5', 'investment', 10],
      ['6', 'charity', 5],
    ];

    for (const jar of defaultJars) {
      await db.runAsync(
        'INSERT INTO jars (id, name, percentage, current_balance, target_balance) VALUES (?, ?, ?, 0, 0)',
        jar
      );
    }

    currentDbVersion = 1;
  }

  if (currentDbVersion === 1) {
    console.log("--- ĐANG THÊM BẢNG BUDGETS CHO NGƯỜI DÙNG CŨ ---");
    await db.execAsync(`
     
    `);
    currentDbVersion = 2;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  console.log("--- ĐÃ CẬP NHẬT LÊN VERSION:", DATABASE_VERSION);
}