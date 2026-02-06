import { showAlert, showToast } from '@/alerts'
import { QUERY_KEYS } from '@/constants'
import { useAppBottomSheet } from '@/contexts/bottom-sheet-provider'
import { IncomesQuery } from '@/database'
import { Income, IncomeFormValues } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as Crypto from 'expo-crypto'
import { useSQLiteContext } from 'expo-sqlite'

export const useIncomeMutation = ({
    reset
}: {
    reset?: () => void
}) => {
    const db = useSQLiteContext()
    const queryClient = useQueryClient()
    const { closeSheet } = useAppBottomSheet()
    

    const invalidateIncomes = () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INCOMES] })
    }

    const { mutate: createIncome, isPending: isCreating } = useMutation({
        mutationFn: async (data: IncomeFormValues) => {
            return await IncomesQuery.create(db, {
                id: Crypto.randomUUID(),
                amount: parseFloat(data.amount),
                note: data.note,
                date: new Date(data.date),
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INCOMES] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JARS] })
            showToast('add_success')
            reset?.()
            closeSheet()
        },
        onError: (error) => {
            console.error('Error creating income:', error)
        }
    })

    const updateIncome = useMutation({
        mutationFn: async (income: Income) => {
            return await IncomesQuery.update(db, income)
        },
        onSuccess: () => {
            invalidateIncomes()
            showToast('update_success')
        },
    })

    const deleteIncome = useMutation({
        mutationFn: async (id: string) => IncomesQuery.delete(db, id),
        onSuccess: () => {
            invalidateIncomes()
            showToast('delete_success')
        },
    })

    const handleDeleteIncome = (id: string) => {
        showAlert('delete_income_confirm', () => {
            deleteIncome.mutate(id)
        })
    }

    const handleUpdateIncome = (income: Income) => {
        updateIncome.mutate(income)
    }

    return {
        isCreating,
        isUpdating: updateIncome.isPending,
        isDeleting: deleteIncome.isPending,
        createIncome,
        handleDeleteIncome,
        handleUpdateIncome,
    }
}