import { useInfiniteQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useSQLiteContext } from 'expo-sqlite'
import { useMemo, useState } from 'react'

import { PAGE_SIZE, QUERY_KEYS } from '@/constants'
import { IncomesQuery } from '@/database'
import { Income } from '@/types'

export function useIncomesInfiniteQuery({ pageSize = PAGE_SIZE }: { pageSize?: number } = {}) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const db = useSQLiteContext()

  const fetchData = async ({ pageParam = 1 }) => {
    const offset = (pageParam - 1) * pageSize

    const data = await IncomesQuery.getAllPaginated(db, {
      page: pageParam,
      pageSize: pageSize,
      dateFilter: format(selectedDate, 'yyyy-MM-dd'),
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
    queryKey: [QUERY_KEYS.INCOMES, selectedDate],
    queryFn: fetchData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.next_page ?? undefined,
  })

  const allIncomes = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data]
  )

  const sections = useMemo(() => {
    const groups = allIncomes.reduce((acc: Record<string, Income[]>, item) => {
      const dateLabel = format(new Date(item.date), 'dd/MM/yyyy')
      if (!acc[dateLabel]) acc[dateLabel] = []
      acc[dateLabel].push(item)
      return acc
    }, {})

    return Object.keys(groups).map((date) => ({
      title: date,
      data: groups[date],
    }))
  }, [allIncomes])

  return {
    selectedDate,
    setSelectedDate,
    ...query,
    sections,
    allIncomes,
  }
}