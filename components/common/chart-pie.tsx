import { useGetColorByKey } from '@/hooks'
import React, { createContext, ReactNode, useContext } from 'react'
import { View, ViewStyle } from 'react-native'
import { PieChart, PieChartPropsType, pieDataItem } from 'react-native-gifted-charts'

import ChipStatus from './chip-status'
import ColumnComponent, { ColumnComponentProps } from './column-component'
import RowComponent from './row-component'
import Suspense from './suspense'
import TextComponent from './text-component'

interface ChartPieCtx {
  data: pieDataItem[]
  totalValue: number
  centerLabel?: string
  legendTitle?: string
  quantityTitle?: string
}

interface ChartPieProps extends ChartPieCtx {
  children: ReactNode
  columnProps?: ColumnComponentProps
}

const ChartPieCtx = createContext<ChartPieCtx | null>(null)

function useChartPieCtx() {
  const ctx = useContext(ChartPieCtx)
  if (!ctx) {
    throw new Error("ChartPie sub-components must be used within <ChartPie />")
  }
  return ctx
}

function MainChart(props: Omit<PieChartPropsType, 'data'>) {
  const { data, totalValue, centerLabel } = useChartPieCtx()
  const { getColorByKey } = useGetColorByKey()

  return (
    <PieChart
      donut
      radius={90}
      innerRadius={60}
      isAnimated
      animationDuration={2000}
      backgroundColor={getColorByKey('background')}
      data={data}
      centerLabelComponent={() => (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TextComponent text={centerLabel} type='label' />
          <TextComponent text={totalValue?.toString()} type='title' />
        </View>
      )}
      {...props}
    />
  )
}

function Legend({ style }: { style?: ViewStyle }) {
  const { data, legendTitle } = useChartPieCtx()

  return (
    <ColumnComponent gap={10} style={style}>
      <TextComponent type="title2" text={legendTitle} />
      {data.map((item, index) => (
        <ChipStatus
          key={`${item.text}-${index}`}
          textProps={{ text: item.text, type: 'label' }}
          statusColor={item.color}
          statusStyle={{ borderRadius: 2 }}
        />
      ))}
    </ColumnComponent>
  )
}

function Statistics({ style }: { style?: ViewStyle }) {
  const { data, quantityTitle } = useChartPieCtx()

  return (
    <ColumnComponent gap={10} alignItems="center" style={style}>
      <TextComponent type="title2" text={quantityTitle} />
      {data.map((item, index) => (
        <TextComponent
          key={`${item.text}-${index}`}
          type="label"
          text={item.value.toString()}
          textAlign="center"
        />
      ))}
    </ColumnComponent>
  )
}

function Footer({ children, style }: { children: ReactNode, style?: ViewStyle }) {
  return (
    <RowComponent gap={50} justify="space-between" style={style}>
      {children}
    </RowComponent>
  )
}


function ChartPie({
  children,
  data,
  totalValue,
  centerLabel,
  legendTitle,
  quantityTitle,
  columnProps,
}: ChartPieProps) {
  
  if (!data || data.length === 0) {
    return <Suspense />
  }

  const value = { data, totalValue, centerLabel, legendTitle, quantityTitle }

  return (
    <ChartPieCtx.Provider value={value}>
      <ColumnComponent gap={20} alignItems="center" {...columnProps}>
        {children}
      </ColumnComponent>
    </ChartPieCtx.Provider>
  )
}

ChartPie.Main = MainChart
ChartPie.Footer = Footer
ChartPie.Legend = Legend
ChartPie.Statistics = Statistics

export default ChartPie