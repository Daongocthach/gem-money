import { showAlert } from '@/alerts'
import { QUERY_KEYS } from '@/constants'
import { useAppBottomSheet } from '@/contexts/bottom-sheet-provider'
import { TransactionsQuery } from '@/database'
import { Transaction } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSQLiteContext } from 'expo-sqlite'

export const useTransactionMutations = () => {
    const db = useSQLiteContext()
    const queryClient = useQueryClient()
    const { closeSheet } = useAppBottomSheet()

    const addTransaction = useMutation({
        mutationFn: (newTx: { id: string, jar_id: string, amount: number, note: string, date: Date }) =>
            TransactionsQuery.create(db, newTx),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JARS] })
            closeSheet()
        },
    })

    const updateTransaction = useMutation({
        mutationFn: (tx: Transaction) =>
            TransactionsQuery.update(db, tx),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JARS] })
            closeSheet()
        },
    })

    const deleteTransaction = useMutation({
        mutationFn: (id: string) =>
            TransactionsQuery.delete(db, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JARS] })
        },
        onError: (error) => {
            console.error('Error deleting transaction:', error)
        }
    })
    const handleDeleteTransaction = (id: string) => {
        showAlert('delete_transaction_confirm', () => {
            deleteTransaction.mutate(id)
        })
    }

    const handleUpdateTransaction = (transaction: Transaction) => {
        updateTransaction.mutate(transaction)
    }
    return {
        addTransaction,
        handleUpdateTransaction,
        handleDeleteTransaction,
        isCreating: addTransaction.isPending,
        isUpdating: updateTransaction.isPending,
        isDeleting: deleteTransaction.isPending
    }
}