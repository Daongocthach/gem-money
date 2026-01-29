import {
    FlatList,
    FlatListProps,
    ListRenderItem,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import RefreshControlComponent from './refresh-control-component'
import Suspense from './suspense'
import TextComponent from './text-component'

interface FlatListComponentProps extends FlatListProps<any> {
    ref?: React.Ref<FlatList<any>>
    data: any[]
    keyExtractor: (item: any) => string
    renderItem: ListRenderItem<any>
    onRefresh?: () => void
    refreshing?: boolean
    loadMore?: () => void
    isLoading?: boolean
    isFetchingNextPage?: boolean
    isError?: boolean
    hasMore?: boolean
    numColumns?: number
    horizontal?: boolean
    hasBottomTabBar?: boolean
    extraPaddingBottom?: number
    showsHorizontalScrollIndicator?: boolean
    columnWrapperStyle?: FlatListProps<any>['columnWrapperStyle']
    contentContainerStyle?: FlatListProps<any>['contentContainerStyle']
    hideFooter?: boolean
}

export default function FlatListComponent({
    ref,
    data = [],
    keyExtractor,
    renderItem,
    onRefresh,
    refreshing = false,
    loadMore,
    isLoading = false,
    isFetchingNextPage = false,
    isError = false,
    hasMore = false,
    numColumns = 1,
    horizontal = false,
    hasBottomTabBar = false,
    extraPaddingBottom = 0,
    showsHorizontalScrollIndicator = false,
    columnWrapperStyle,
    contentContainerStyle,
    hideFooter = false,
    ...props
}: FlatListComponentProps) {
    const insets = useSafeAreaInsets()
    const safeData = Array.isArray(data) ? data : []

    return (
        <FlatList
            ref={ref}
            data={safeData}
            numColumns={numColumns}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            horizontal={horizontal}
            showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
            refreshControl={
                onRefresh ? (
                    <RefreshControlComponent
                        refreshing={refreshing || isLoading}
                        onRefresh={onRefresh}
                    />
                ) : undefined
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
                hideFooter ? null :
                    (!isLoading && safeData?.length === 0) ? (
                        <TextComponent
                            textAlign='center'
                            type='caption'
                            text={isError ? 'error loading data' : 'no data found'}
                            style={{ marginVertical: 16 }}
                        />
                    ) : null
            }
            ListFooterComponent={
                hideFooter ? null :
                    (isLoading && safeData?.length === 0) ? (
                        <Suspense />
                    ) : (isFetchingNextPage) ? (
                        <TextComponent
                            textAlign='center'
                            type='caption'
                            text="loading more"
                            style={{ marginVertical: 16 }}
                        />
                    ) : (!hasMore && safeData?.length > 0) ? (
                        <TextComponent
                            textAlign='center'
                            type='caption'
                            text="end of page"
                            style={{ marginVertical: 16 }}
                        />
                    ) : null
            }
            {...(numColumns > 1 && {
                columnWrapperStyle: [{
                    justifyContent: 'space-between',
                    gap: 10,
                }, columnWrapperStyle],
            })}
            contentContainerStyle={[{
                paddingHorizontal: 2,
                gap: 10,
                paddingBottom: insets.bottom + (hasBottomTabBar ? 150 : 30) + extraPaddingBottom,
            }, contentContainerStyle]}
            {...props}
        />
    )
}