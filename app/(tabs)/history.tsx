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
import { useHistoryScreen } from '@/components/history/hooks/use-history'
import SpendingPieChart from '@/components/history/spending-pie-chart'
import WeeklySpendingChart from '@/components/history/weekly-spending-chart'
import { useTransactionMutations } from '@/components/transactions/hooks/use-transaction-mutation'
import { useTransactionsInfiniteQuery } from '@/components/transactions/hooks/use-transactions'
import { Transaction } from '@/types'
import { formatCurrency } from '@/utils'

export default function HistoryScreen() {
  const {
    sections,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
    isError
  } = useTransactionsInfiniteQuery({})

  const {
    pieData,
    totalValue,
    barChartData
  } = useHistoryScreen()

  const {
    handleDeleteTransaction,
  } = useTransactionMutations()

  const renderItem = ({ item }: { item: Transaction }) => (
    <RowComponent justify='space-between' gap={20} style={{ paddingVertical: 10 }}>
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
              mode="text"
              iconProps={{ name: 'Pencil', size: 14 }}
              textProps={{ text: 'edit' }}
              onPress={() => {

              }}
              buttonStyle={{ justifyContent: 'flex-start' }}
            />
            <ButtonComponent
              mode="text"
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
    <Container>
      <SectionListComponent
        sections={sections}
        keyExtractor={(item: Transaction) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasMore={hasNextPage}
        isError={isError}
        ListHeaderComponent={
          <ColumnComponent gap={10} style={{ marginBottom: 20 }}>
            <WeeklySpendingChart barChartData={barChartData} />
            <SpendingPieChart pieData={pieData} totalValue={totalValue} />
          </ColumnComponent>
        }
        onRefresh={refetch}
        refreshing={isRefetching}
        loadMore={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage()
        }}
        stickySectionHeadersEnabled={true}
        extraPaddingBottom={100}
      />
    </Container>
  )
}
