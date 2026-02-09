import { ButtonComponent, ColumnComponent, Container, IconComponent, MenuComponent, RowComponent, SectionListComponent, TextComponent } from '@/components'
import MonthSelector from '@/components/common/month-selector'
import { useIncomeMutation } from '@/components/incomes/hooks/use-income-mutation'
import { useIncomesInfiniteQuery } from '@/components/incomes/hooks/use-incomes'
import { Income } from '@/types'
import { formatCurrency } from '@/utils'
import React from 'react'

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
                    text={item.note || 'no_description'}
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
                            mode="text"
                            iconProps={{
                                name: 'Pencil',
                                size: 14,
                            }}
                            textProps={{
                                text: 'edit',
                            }}
                            buttonStyle={{
                                justifyContent: 'flex-start',
                            }}
                            onPress={() => {

                            }}
                        />
                        <ButtonComponent
                            mode="text"
                            iconProps={{
                                name: 'Trash2',
                                color: 'error',
                                size: 14,

                            }}
                            textProps={{
                                text: 'delete',
                            }}
                            buttonStyle={{
                                justifyContent: 'flex-start',
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
                        text={'+' + formatCurrency(item.amount)}
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