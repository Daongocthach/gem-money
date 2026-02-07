import { useInfiniteQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useSQLiteContext } from 'expo-sqlite'
import { useMemo, useState } from 'react'

import { PAGE_SIZE, QUERY_KEYS } from '@/constants'
import { TransactionsQuery } from '@/database'
import { Transaction } from '@/types'

export function useTransactionsInfiniteQuery({ 
  pageSize = PAGE_SIZE,
  jarId 
}: { 
  pageSize?: number
  jarId?: string
} = {}) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const db = useSQLiteContext()

  const fetchData = async ({ pageParam = 1 }) => {
    const data = await TransactionsQuery.getAllPaginated(db, {
      page: pageParam,
      pageSize: pageSize,
      dateFilter: format(selectedDate, 'yyyy-MM-dd'),
      jarId: jarId,
    })

    return {
      data,
      pagination: {
        current_page: pageParam,
        next_page: data.length === pageSize ? pageParam + 1 : null,
      },
    }
  }

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, selectedDate, jarId],
    queryFn: fetchData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.next_page ?? undefined,
  })

  const allTransactions = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data]
  )

  const sections = useMemo(() => {
    const groups = allTransactions.reduce((acc: Record<string, Transaction[]>, item) => {
      const dateLabel = format(new Date(item.date), 'dd/MM/yyyy')
      
      if (!acc[dateLabel]) {
        acc[dateLabel] = []
      }
      acc[dateLabel].push(item)
      return acc
    }, {})

    return Object.keys(groups).map((date) => ({
      title: date,
      data: groups[date],
    }))
  }, [allTransactions])

  return {
    ...query,
    selectedDate,
    setSelectedDate,
    sections,
    allTransactions,
  }
}