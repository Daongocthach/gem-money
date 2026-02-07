import { View } from 'react-native'
import { PieChart, PieChartPropsType, pieDataItem } from 'react-native-gifted-charts'

import ChipStatus from './chip-status'
import ColumnComponent, { ColumnComponentProps } from './column-component'
import RowComponent from './row-component'
import TextComponent from './text-component'

import { useGetColorByKey } from '@/hooks'
import { formatCurrency } from '@/utils'
import Suspense from './suspense'


type ChartPieProps = Omit<PieChartPropsType, 'data'> & {
  data: pieDataItem[]
  legendTitle?: string
  quantityTitle?: string
  centerLabel?: string
  totalValue: string
  columnProps?: ColumnComponentProps
  radius?: number
  innerRadius?: number
}

export default function ChartPie({
  legendTitle,
  quantityTitle,
  centerLabel,
  totalValue,
  columnProps,
  radius = 80,
  innerRadius = 65,
  ...props
}: ChartPieProps) {
  const { getColorByKey } = useGetColorByKey()

  if (!props.data || props.data.length === 0) {
    return <Suspense />
  }

  return (
    <ColumnComponent gap={20} alignItems="center" style={columnProps}>
      <PieChart
        donut
        radius={radius}
        innerRadius={innerRadius}
        isAnimated
        animationDuration={2000}
        backgroundColor={getColorByKey('background')}
        centerLabelComponent={() => {
          return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TextComponent text={centerLabel} type='label' />
              <TextComponent text={totalValue?.toString()} type='title' />
            </View>
          )
        }}
        {...props}
      />

      <RowComponent gap={50} justify="space-between">
        <ColumnComponent gap={10}>
          <TextComponent type="title2" text={legendTitle} />
          {props.data.map(item => (
            <ChipStatus
              key={item.text}
              textProps={{ text: item.text, type: 'label' }}
              statusColor={item.color}
              statusStyle={{ borderRadius: 2 }}
            />
          ))}
        </ColumnComponent>

        <ColumnComponent gap={10} alignItems="center">
          <TextComponent type="title2" text={quantityTitle} />
          {props.data.map(item => (
            <TextComponent
              key={item.text}
              type="label"
              text={formatCurrency(item?.value)}
              textAlign="center"
            />
          ))}
        </ColumnComponent>
      </RowComponent>
    </ColumnComponent>
  )
}
