import { useEffect, useRef } from 'react'
import { FlatList } from 'react-native'

export function useFlatListScrollToTopOnToggle<T = any>(
  isActive: boolean
) {
  const listRef = useRef<FlatList<T>>(null)

  useEffect(() => {
    if (isActive) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToOffset({
          offset: 0,
          animated: true,
        })
      })
    }
  }, [isActive])

  return listRef
}
