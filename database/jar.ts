import { type SQLiteDatabase } from 'expo-sqlite';

export interface Jar {
  id: string;
  name: string;
  percentage: number;
  current_balance: number;
  is_active: number;
}

export const getAllJars = async (db: SQLiteDatabase): Promise<Jar[]> => {
  return await db.getAllAsync<Jar>(
    'SELECT * FROM jars WHERE is_active = 1 ORDER BY percentage DESC'
  );
};