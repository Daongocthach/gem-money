import { useTheme } from "@/hooks"
import React, { useEffect, useMemo, useRef } from 'react'
import {
    ListRenderItem,
    SectionList,
    SectionListProps,
    View
} from 'react-native'
import RefreshControlComponent from './refresh-control-component'
import TextComponent from './text-component'

type AnySection = { title?: string; data: any[] }

interface SectionListComponentProps
    extends Omit<SectionListProps<any, AnySection>, 'sections' | 'renderItem' | 'keyExtractor'> {
    sections: AnySection[]
    keyExtractor: (item: any, index: number) => string
    renderItem: ListRenderItem<any>
    renderSectionHeader?: SectionListProps<any, AnySection>['renderSectionHeader']
    onRefresh?: () => void
    refreshing?: boolean
    loadMore?: () => void
    hasNextPage?: boolean
    isLoading?: boolean
    isFetchingNextPage?: boolean
    isError?: boolean
    stickySectionHeadersEnabled?: boolean
    contentContainerStyle?: SectionListProps<any, AnySection>['contentContainerStyle']
    onEndReachedThreshold?: number
}

export default function SectionListComponent({
    sections,
    keyExtractor,
    renderItem,
    renderSectionHeader,
    onRefresh,
    refreshing = false,
    loadMore,
    hasNextPage = false,
    isLoading = false,
    isFetchingNextPage = false,
    isError = false,
    stickySectionHeadersEnabled = true,
    contentContainerStyle,
    onEndReachedThreshold = 0.1,
    ...props
}: SectionListComponentProps) {
    const { colors } = useTheme()

    const canLoadMoreRef = useRef(false)
    const lastCalledCountRef = useRef(0)

    const totalItems = useMemo(
        () => sections.reduce((sum, section) => sum + (section.data?.length ?? 0), 0),
        [sections]
    )

    useEffect(() => {
        if (totalItems > lastCalledCountRef.current) {
            canLoadMoreRef.current = true
        }
    }, [totalItems])

    const handleEndReached = () => {
        if (!loadMore) return
        if (!hasNextPage) return
        if (isFetchingNextPage) return
        if (!canLoadMoreRef.current) return

        if (lastCalledCountRef.current === totalItems) return

        canLoadMoreRef.current = false
        lastCalledCountRef.current = totalItems
        loadMore()
    }

    const defaultHeader: SectionListProps<any, AnySection>['renderSectionHeader'] =
        ({ section }) =>
            section.title ? (
                <View
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor: colors.background,
                        borderRadius: 8
                    }}
                >
                    <TextComponent text={section.title} />
                </View>
            ) : null


    const ListEmptyComponent = useMemo(() => {
        if (!isLoading && totalItems < 1) {
            return (
                <TextComponent
                    textAlign='center'
                    type='caption'
                    text={isError ? 'error loading data' : 'no data found'}
                    style={{ marginVertical: 16 }}
                />
            )
        }
        return null
    }, [totalItems, isLoading, isError, colors.outlineVariant])

    const ListFooterComponent = useMemo(() => {
        if (totalItems === 0) return null;

        if (isFetchingNextPage) {
            return (
                <TextComponent
                    textAlign='center'
                    type='caption'
                    text="loading more"
                    style={{ marginVertical: 16 }}
                />
            )
        }

        if (!hasNextPage) {
            return (
                <TextComponent
                    textAlign='center'
                    type='caption'
                    text="end of page"
                    style={{ marginVertical: 16 }}
                />
            )
        }

        return null;

    }, [totalItems, isFetchingNextPage, hasNextPage, colors.outlineVariant]);


    return (
        <SectionList
            sections={sections}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader ?? defaultHeader}
            stickySectionHeadersEnabled={stickySectionHeadersEnabled}
            refreshControl={
                onRefresh ? (
                    <RefreshControlComponent
                        refreshing={refreshing}
                        onRefresh={() => {
                            lastCalledCountRef.current = 0
                            canLoadMoreRef.current = false
                            onRefresh()
                        }}
                    />
                ) : undefined
            }
            onMomentumScrollBegin={() => {
                canLoadMoreRef.current = true
            }}
            onEndReached={handleEndReached}
            onEndReachedThreshold={onEndReachedThreshold}
            ListEmptyComponent={ListEmptyComponent}
            ListFooterComponent={ListFooterComponent}
            contentContainerStyle={[
                { paddingHorizontal: 2, gap: 8 },
                contentContainerStyle,
            ]}
            {...props}
        />
    )
}