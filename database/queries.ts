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
  }
}