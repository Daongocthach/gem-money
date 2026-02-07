import { QUERY_KEYS } from '@/constants'
import { JarsQuery, TransactionsQuery } from '@/database'
import { useGetColorByKey } from '@/hooks'
import { PieDataProps } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { useSQLiteContext } from 'expo-sqlite'
import { useMemo } from 'react'

export const useHistoryScreen = () => {
    const db = useSQLiteContext()
    const { getColorByKey } = useGetColorByKey()

    const pieChartQuery = useQuery({
        queryKey: [QUERY_KEYS.PIE_CHART],
        queryFn: () => JarsQuery.getSpendingPieData(db),
    })

    const weeklyChartQuery = useQuery({
        queryKey: [QUERY_KEYS.WEEKLY_CHART],
        queryFn: () => TransactionsQuery.getWeeklySpending(db),
    })

    const pieData: PieDataProps = useMemo(
        () =>
            pieChartQuery?.data?.map((item) => ({
                value: item.value,
                color: getColorByKey(item.color) ?? '#000000',
                text: item.text,
            })) || [],
        [pieChartQuery.data, getColorByKey]
    )

    const barChartData = useMemo(() => {
        if (!weeklyChartQuery.data) return []

        return weeklyChartQuery.data
    }, [weeklyChartQuery.data])


    const totalValue = useMemo(() => {
        return pieChartQuery?.data?.reduce((acc, curr) => acc + curr.value, 0) || 0
    }, [pieChartQuery.data])

    return {
        ...pieChartQuery,
        ...weeklyChartQuery,
        pieData,
        barChartData,
        totalValue,
    }
}