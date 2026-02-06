import { ButtonComponent, ColumnComponent, Container, IconComponent, MenuComponent, RowComponent, SectionListComponent, TextComponent } from '@/components'
import MonthSelector from '@/components/common/month-selector'
import { useIncomeMutation } from '@/components/incomes/hooks/use-income-mutation'
import { useIncomesInfiniteQuery } from '@/components/incomes/hooks/use-incomes'
import { Income } from '@/types'
import React from 'react'
import {
    StyleSheet
} from 'react-native'

export default function IncomesScreen() {

    const {
        sections,
        selectedDate,
        setSelectedDate,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching,
        isError
    } = useIncomesInfiniteQuery()

    const {
        handleDeleteIncome,
    } = useIncomeMutation({})

    const renderItem = ({ item }: { item: Income }) => (
        <RowComponent justify='space-between' gap={20}>
            <ColumnComponent style={{ flexShrink: 1 }} gap={10}>
                <TextComponent
                    text={item.note || 'no description'}
                    type='title2'
                    style={{ flexShrink: 1 }}
                />
                <TextComponent
                    text={new Date(item.date).toLocaleDateString() || ''}
                    type='caption'
                />
            </ColumnComponent>
            <MenuComponent
                menuChildren={() => (
                    <ColumnComponent gap={24}>
                        <ButtonComponent
                            isIconOnly
                            iconProps={{
                                name: 'Pencil',
                                size: 14,
                            }}
                            textProps={{
                                text: 'edit',
                            }}
                            onPress={() => {

                            }}
                            buttonStyle={{
                                justifyContent: 'flex-start',
                            }}
                        />
                        <ButtonComponent
                            isIconOnly
                            iconProps={{
                                name: 'Trash2',
                                color: 'error',
                                size: 14,

                            }}
                            textProps={{
                                text: 'delete',
                            }}
                            onPress={() => {
                                handleDeleteIncome(item.id)
                            }}
                        />
                    </ColumnComponent>
                )}
            >
                <RowComponent gap={15}>
                    <TextComponent
                        text={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amount)}
                        type='title2'
                        color='success'
                        fontWeight='semibold'
                    />
                    <IconComponent
                        name='GripVertical'
                        size={20}
                    />
                </RowComponent>
            </MenuComponent>
        </RowComponent>
    )

    const renderSectionHeader = ({ section }: any) => (
        <ButtonComponent
            textProps={{
                text: section?.title,
                color: 'onCard',
                textAlign: 'left',
            }}
            style={{
                flex: 1,
            }}
            backgroundColor={'card'}
            buttonStyle={{
                borderRadius: 0,
                flex: 1,
                justifyContent: 'flex-start',
            }}
        />
    )

    return (
        <Container headerTitle='incomes'>
            <MonthSelector
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />

            <SectionListComponent
                sections={sections}
                keyExtractor={(item: Income) => item.id.toString()}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}

                isLoading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                hasMore={hasNextPage}
                isError={isError}

                onRefresh={refetch}
                refreshing={isRefetching}
                loadMore={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
                }}

                stickySectionHeadersEnabled={true}
                contentContainerStyle={{ gap: 20 }}
                style={{
                    marginTop: 20,
                }}
            />
        </Container>
    )
}

const styles = StyleSheet.create({
    sectionHeader: {
        backgroundColor: '#f8f9fa',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#dee2e6',
    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#495057',
        textTransform: 'uppercase',
    },
    incomeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#f1f3f5',
    },
    leftContent: { flex: 1 },
    noteText: { fontSize: 16, color: '#212529', marginBottom: 2 },
    timeText: { fontSize: 12, color: '#adb5bd' },
    amountText: { fontSize: 16, fontWeight: '700', color: '#2ecc71' },
})