import { TableColumn } from '@/types'
import React from 'react'
import { View, ViewStyle } from 'react-native'
import RowComponent from './row-component'
import TextComponent from './text-component'

type TableHeaderProps<T> = {
  columns: TableColumn<T>[]
  layout?: 'auto' | 'equal'
  style?: ViewStyle
  columnGap?: number
}

export default function TableHeader<T>({
  columns,
  layout = 'auto',
  style,
  columnGap = 12,
}: TableHeaderProps<T>) {
  return (
    <RowComponent
      justify="space-around"
      backgroundColor='cardDisabled'
      style={[{ 
        width: '100%',
        padding: 12,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    }, style]}
    >
      {columns.map((column, index) => (
        <View
          key={String(column.key)}
          style={[
            layout === 'equal'
              ? {
                  flex: 1,
                  maxWidth: column.maxWidth,
                  alignItems: column.align ?? 'flex-start',
                }
              : {
                  alignSelf: 'flex-start',
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth,
                  marginRight:
                    index < columns.length - 1 ? columnGap : 0,
                },
          ]}
        >
          <TextComponent
            text={column.label ?? String(column.key)}
            type="label"
            color="onCardDisabled"
            numberOfLines={column.numberOfLines ?? 1}
            ellipsizeMode="tail"
          />
        </View>
      ))}
    </RowComponent>
  )
}
