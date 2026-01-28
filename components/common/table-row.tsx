import { TableColumn } from '@/types'
import React from 'react'
import { View, ViewStyle } from 'react-native'
import RowComponent from './row-component'
import TextComponent from './text-component'

type TableRowProps<T> = {
    columns: TableColumn<T>[]
    data: T
    layout?: 'auto' | 'equal'
    style?: ViewStyle
    columnGap?: number
}

export default function TableRow<T>({
    columns,
    data,
    layout = 'auto',
    style,
    columnGap = 10,
}: TableRowProps<T>) {
    return (
        <RowComponent
            justify="space-around"
            style={[
                {
                    padding: 12
                }, style
            ]}>
            {columns.map((column, index) => {
                const value = String((data as any)[column.key] ?? '')

                const content = column.render
                    ? column.render(value, data)
                    : (
                        <TextComponent
                            text={String(value ?? '')}
                            numberOfLines={column.numberOfLines}
                            ellipsizeMode="tail"
                        />
                    )

                return (
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
                                    alignItems: column.align ?? 'flex-start',
                                    minWidth: column.minWidth,
                                    maxWidth: column.maxWidth,
                                    marginRight:
                                        index < columns.length - 1 ? columnGap : 0,
                                },
                        ]}
                    >
                        {content}
                    </View>
                )
            })}
        </RowComponent>
    )
}
