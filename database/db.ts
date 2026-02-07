import * as SQLite from 'expo-sqlite';

async function hardResetDatabase(db: SQLite.SQLiteDatabase) {
  console.log("--- 🚨 ĐANG XÓA SẠCH DATABASE ĐỂ RESET... 🚨 ---")

  await db.execAsync('PRAGMA foreign_keys = OFF;')

  const tables = await db.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
  );

  for (const table of tables) {
    await db.execAsync(`DROP TABLE IF EXISTS ${table.name};`)
    console.log(`--- Đã xóa bảng: ${table.name}`)
  }

  // Quan trọng: Reset version về 0
  await db.execAsync('PRAGMA user_version = 0;')
  await db.execAsync('PRAGMA foreign_keys = ON;')

  console.log("--- ✅ ĐÃ RESET XONG ---")
}

export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
  // LƯU Ý: Chỉ bật dòng này khi bạn thực sự muốn xóa sạch dữ liệu để làm lại từ đầu
  // await hardResetDatabase(db);
  const DATABASE_VERSION = 1

  // Đọc lại version sau khi reset
  let result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version')
  let currentDbVersion = result?.user_version ?? 0

  console.log("--- DB VERSION HIỆN TẠI:", currentDbVersion)

  if (currentDbVersion >= DATABASE_VERSION) return

  if (currentDbVersion === 0) {
    console.log("--- ĐANG KHỞI TẠO DATABASE LẦN ĐẦU...")

    // Tách PRAGMA ra khỏi chuỗi CREATE TABLE
    await db.execAsync("PRAGMA journal_mode = 'wal';")
    await db.execAsync("PRAGMA foreign_keys = ON;")

    await db.execAsync(`
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

      CREATE TABLE IF NOT EXISTS incomes (
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
        amount REAL NOT NULL,
        note TEXT,
        date INTEGER NOT NULL,
        is_deleted INTEGER DEFAULT 0,
        sync_status TEXT DEFAULT 'pending',
        updated_at INTEGER,
        FOREIGN KEY (jar_id) REFERENCES jars (id)
      );
    `);

    const defaultJars = [
      ['1', 'essential', 55, 'ShoppingCart', 'primary'],
      ['2', 'savings', 10, 'PiggyBank', 'secondary'], 
      ['3', 'education', 10, 'GraduationCap', 'tertiary'],
      ['4', 'enjoyment', 10, 'Gamepad2', 'quaternary'],
      ['5', 'investment', 10, 'TrendingUp', 'quinary'],  
      ['6', 'charity', 5, 'Heart', 'senary'],          
    ];

    for (const jar of defaultJars) {
      await db.runAsync(
        'INSERT INTO jars (id, name, percentage, icon, color, current_balance, target_balance) VALUES (?, ?, ?, ?, ?, 0, 0)',
        jar
      );
    }

    currentDbVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
  console.log("--- HOÀN TẤT: DATABASE ĐANG Ở VERSION", DATABASE_VERSION)
}