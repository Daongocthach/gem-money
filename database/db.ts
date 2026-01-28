import * as SQLite from 'expo-sqlite'

export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
  const DATABASE_VERSION = 1
  
  let result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version')
  let currentDbVersion = result?.user_version ?? 0

  if (currentDbVersion >= DATABASE_VERSION) return

  if (currentDbVersion === 0) {
    // Khởi tạo DB lần đầu tiên
    await db.execAsync(`
      PRAGMA journal_mode = 'wal'
      
      CREATE TABLE IF NOT EXISTS jars (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        percentage REAL NOT NULL,
        current_balance REAL DEFAULT 0,
        is_active INTEGER DEFAULT 1
      )

      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        jar_id TEXT NOT NULL,
        amount REAL NOT NULL,
        note TEXT,
        date INTEGER NOT NULL,
        FOREIGN KEY (jar_id) REFERENCES jars (id)
      )
    `)

    const defaultJars = [
      ['1', 'Thiết yếu', 55],
      ['2', 'Tiết kiệm', 10],
      ['3', 'Giáo dục', 10],
      ['4', 'Hưởng thụ', 10],
      ['5', 'Đầu tư', 10],
      ['6', 'Từ thiện', 5],
    ]

    for (const jar of defaultJars) {
      await db.runAsync(
        'INSERT INTO jars (id, name, percentage, current_balance) VALUES (?, ?, ?, 0)',
        jar
      )
    }

    currentDbVersion = 1
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
}