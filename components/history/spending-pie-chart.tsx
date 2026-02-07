import CardContainer from '@/components/common/card-container'
import ChartPie from '@/components/common/chart-pie'
import TextComponent from '@/components/common/text-component'
import { PieDataProps } from '@/types'
import { formatCurrency } from '@/utils'

export default function SpendingPieChart({
  pieData,
  totalValue,
}: {
  pieData: PieDataProps
  totalValue: number
}) {
  return (
    <CardContainer isBorder gap={20}>
      <TextComponent text='expenses_by_jars' type='title2' />

      <ChartPie
        data={pieData}
        totalValue={formatCurrency(totalValue)}
        centerLabel="total_expenses"
        legendTitle="categories"
        quantityTitle="amount"
        sectionAutoFocus
        focusOnPress
      />
    </CardContainer>
  )
}