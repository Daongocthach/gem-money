import {
    ButtonComponent,
    ColumnComponent,
    Container,
    IconComponent,
    MenuComponent,
    RowComponent,
    SectionListComponent,
    TextComponent
} from '@/components'
import MonthSelector from '@/components/common/month-selector'
import { useTransactionMutations } from '@/components/transactions/hooks/use-transaction-mutation'
import { useTransactionsInfiniteQuery } from '@/components/transactions/hooks/use-transactions'
import { Transaction } from '@/types'
import { formatCurrency } from '@/utils'
import { useLocalSearchParams } from 'expo-router'

export default function TransactionsScreen() {
    const { jar_id } = useLocalSearchParams<{ jar_id?: string }>()

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
    } = useTransactionsInfiniteQuery({ jarId: jar_id })

    const {
        handleDeleteTransaction,
    } = useTransactionMutations()

    const renderItem = ({ item }: { item: Transaction }) => (
        <RowComponent justify='space-between' gap={20}>
            <ColumnComponent style={{ flexShrink: 1 }} gap={10}>
                <TextComponent
                    text={item.note || 'no_description'}
                    type='title2'
                    style={{ flexShrink: 1 }}
                />
                <TextComponent
                    text={new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    type='caption'
                />
            </ColumnComponent>

            <MenuComponent
                menuChildren={() => (
                    <ColumnComponent gap={24}>
                        <ButtonComponent
                            isIconOnly
                            iconProps={{ name: 'Pencil', size: 14 }}
                            textProps={{ text: 'edit' }}
                            onPress={() => {
                                // Logic mở modal sửa ở đây
                            }}
                            buttonStyle={{ justifyContent: 'flex-start' }}
                        />
                        <ButtonComponent
                            isIconOnly
                            iconProps={{
                                name: 'Trash2',
                                color: 'error',
                                size: 14,
                            }}
                            textProps={{ text: 'delete' }}
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            onPress={() => {
                                handleDeleteTransaction(item.id)
                            }}
                        />
                    </ColumnComponent>
                )}
            >
                <RowComponent gap={15}>
                    <TextComponent
                        text={'-' + formatCurrency(item.amount)}
                        type='title2'
                        color='error'
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
            style={{ flex: 1 }}
            backgroundColor={'card'}
            buttonStyle={{
                borderRadius: 0,
                flex: 1,
                justifyContent: 'flex-start',
            }}
        />
    )

    return (
        <Container headerTitle='Transactions'>
            <MonthSelector
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />

            <SectionListComponent
                sections={sections}
                keyExtractor={(item: Transaction) => item.id}
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
                contentContainerStyle={{ gap: 20, paddingBottom: 100 }}
                style={{ marginTop: 20 }}
            />
        </Container>
    )
}
