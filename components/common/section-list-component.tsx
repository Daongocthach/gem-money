import React from 'react'
import {
    DefaultSectionT,
    SectionList,
    SectionListData,
    SectionListProps,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import RefreshControlComponent from './refresh-control-component'
import Suspense from './suspense'
import TextComponent from './text-component'

interface SectionListComponentProps extends SectionListProps<any, DefaultSectionT> {
    ref?: React.Ref<SectionList<any, DefaultSectionT>>
    sections: SectionListData<any, DefaultSectionT>[]
    keyExtractor: (item: any, index: number) => string
    renderItem: (info: { item: any; index: number; section: SectionListData<any, DefaultSectionT> }) => React.ReactElement | null
    renderSectionHeader?: (info: { section: SectionListData<any, DefaultSectionT> }) => React.ReactElement | null
    onRefresh?: () => void
    refreshing?: boolean
    loadMore?: () => void
    isLoading?: boolean
    isFetchingNextPage?: boolean
    isError?: boolean
    hasMore?: boolean
    hasBottomTabBar?: boolean
    extraPaddingBottom?: number
    contentContainerStyle?: SectionListProps<any, DefaultSectionT>['contentContainerStyle']
    hideFooter?: boolean
}

export default function SectionListComponent({
    ref,
    sections = [],
    keyExtractor,
    renderItem,
    renderSectionHeader,
    onRefresh,
    refreshing = false,
    loadMore,
    isLoading = false,
    isFetchingNextPage = false,
    isError = false,
    hasMore = false,
    hasBottomTabBar = false,
    extraPaddingBottom = 0,
    contentContainerStyle,
    hideFooter = false,
    ...props
}: SectionListComponentProps) {
    const insets = useSafeAreaInsets()
    
    // Kiểm tra dữ liệu hợp lệ
    const safeSections = Array.isArray(sections) ? sections : []
    const isEmpty = safeSections.length === 0 || safeSections.every(s => s.data.length === 0)

    return (
        <SectionList
            ref={ref}
            sections={safeSections}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            stickySectionHeadersEnabled={true} // Tùy chọn giữ header ở trên cùng
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
                    (!isLoading && isEmpty) ? (
                        <TextComponent
                            textAlign='center'
                            type='caption'
                            text={isError ? 'Error loading data' : 'No data found'}
                            style={{ marginVertical: 16 }}
                        />
                    ) : null
            }
            ListFooterComponent={
                hideFooter ? null :
                    (isLoading && isEmpty) ? (
                        <Suspense />
                    ) : (isFetchingNextPage) ? (
                        <TextComponent
                            textAlign='center'
                            type='caption'
                            text="Loading more..."
                            style={{ marginVertical: 16 }}
                        />
                    ) : (!hasMore && !isEmpty) ? (
                        <TextComponent
                            textAlign='center'
                            type='caption'
                            text="End of list"
                            style={{ marginVertical: 16 }}
                        />
                    ) : null
            }
            contentContainerStyle={[{
                paddingHorizontal: 2,
                paddingBottom: insets.bottom + (hasBottomTabBar ? 150 : 30) + extraPaddingBottom,
            }, contentContainerStyle]}
            {...props}
        />
    )
}