import { showToast } from '@/alerts'
import { QUERY_KEYS } from '@/constants'
import { JarsQuery } from '@/database'
import { Jar } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as Crypto from 'expo-crypto'
import { useSQLiteContext } from 'expo-sqlite'

export const useJarMutations = () => {
  const db = useSQLiteContext()
  const queryClient = useQueryClient()

  const invalidateJars = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JARS] })
  }

  const createJar = useMutation({
    mutationFn: async (data: Omit<Jar, 'id' | 'current_balance' | 'target_balance' | 'is_active'>) => {
      return await JarsQuery.create(db, {
        ...data,
        id: Crypto.randomUUID(),
      })
    },
    onSuccess: () => {
      invalidateJars()
      showToast('create_success')
    },
  })

  const updateJar = useMutation({
    mutationFn: async (jar: Partial<Jar> & { id: string }) => {
      return await JarsQuery.updateJar(db, jar)
    },
    onSuccess: () => {
      invalidateJars()
      showToast('update_success')
    },
  })

  const deleteJar = useMutation({
    mutationFn: async (id: string) => {
      return await db.runAsync('UPDATE jars SET is_active = 0 WHERE id = ?', [id])
    },
    onSuccess: () => {
      invalidateJars()
      showToast('delete_success')
    },
  })

  return {
    createJar,
    updateJar,
    deleteJar,
    isCreating: createJar.isPending,
    isUpdating: updateJar.isPending,
    isDeleting: deleteJar.isPending,
  }
}