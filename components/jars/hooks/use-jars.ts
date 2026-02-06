import { QUERY_KEYS } from '@/constants'
import { IncomesQuery, JarsQuery } from '@/database'
import { useQuery } from '@tanstack/react-query'
import { useSQLiteContext } from 'expo-sqlite'

export const useHomeScreen = () => {
    const db = useSQLiteContext()

    const jarQuery = useQuery({
        queryKey: [QUERY_KEYS.JARS],
        queryFn: () => JarsQuery.getAll(db),
    })

    const incomeQuery = useQuery({
        queryKey: [QUERY_KEYS.INCOMES],
        queryFn: () => IncomesQuery.getTotalAmount(db),
    })

    const jars = jarQuery.data || []
    const totalItems = jars.length
    const totalBalance = incomeQuery.data || 0

    return {
        ...jarQuery,
        ...incomeQuery,
        jars,
        totalItems,
        totalBalance,
    }
}