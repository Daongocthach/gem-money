import AsyncStorage from '@react-native-async-storage/async-storage'
import { StateStorage } from 'zustand/middleware'

export const asyncStorage: StateStorage = {
  setItem: async (name, value) => {
    try {
      await AsyncStorage.setItem(name, value)
    } catch (error) {
      console.error('Error setting AsyncStorage item:', error)
    }
  },
  getItem: async (name) => {
    try {
      return await AsyncStorage.getItem(name)
    } catch (error) {
      console.error('Error getting AsyncStorage item:', error)
      return null
    }
  },
  removeItem: async (name) => {
    try {
      await AsyncStorage.removeItem(name)
    } catch (error) {
      console.error('Error removing AsyncStorage item:', error)
    }
  },
}
