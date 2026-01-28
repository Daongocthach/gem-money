import { useQueryClient } from '@tanstack/react-query'

export function useInfiniteListUpdater<T>(queryKey: (string | number)[]) {
  const queryClient = useQueryClient()

  const update = (newItem: T, position: 'start' | 'end' = 'start') => {
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData || !oldData.pages) return oldData

      const updatedPages = oldData.pages.map((page: any, index: number) => {
        if (index !== 0) return page

        return {
          ...page,
          data:
            position === 'start'
              ? [newItem, ...page.data]
              : [...page.data, newItem],
          pagination: {
            ...page.pagination,
            total_items: (page.pagination?.total_items ?? 0) + 1,
          },
        }
      })

      return { ...oldData, pages: updatedPages }
    })
  }

  return {
    prependItem: (item: T) => update(item, 'start'),
    appendItem: (item: T) => update(item, 'end'),
  }
}
