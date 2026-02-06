import { QUERY_KEYS } from '@/constants'
import { TransactionsQuery } from '@/database'
import { Transaction } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSQLiteContext } from 'expo-sqlite'

export const useTransactionMutations = () => {
    const db = useSQLiteContext()
    const queryClient = useQueryClient()

    const addTransaction = useMutation({
        mutationFn: (newTx: { id: string, jar_id: string, amount: number, note: string, date: Date }) => 
            TransactionsQuery.create(db, newTx),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JARS] })
        },
    })

    const updateTransaction = useMutation({
        mutationFn: (tx: Transaction) => 
            TransactionsQuery.update(db, tx),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JARS] })
        },
    })

    const deleteTransaction = useMutation({
        mutationFn: (id: string) => 
            TransactionsQuery.delete(db, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JARS] })
        },
    })

    return {
        addTransaction,
        updateTransaction,
        deleteTransaction,
        isPending: addTransaction.isPending || updateTransaction.isPending || deleteTransaction.isPending
    }
}