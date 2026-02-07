import { useGetColorByKey, useTheme } from '@/hooks'
import { ThemeColorKeys } from '@/types/theme.type'
import React from 'react'
import { DimensionValue, StyleProp, View, ViewStyle } from 'react-native'

interface DividerProps {
    style?: StyleProp<ViewStyle>
    color?: ThemeColorKeys
    thickness?: number
    length?: DimensionValue
    type?: 'horizontal' | 'vertical'
}

export default function Divider({
    style,
    color,
    thickness = 1,
    length = '100%',
    type = 'horizontal'
}: DividerProps) {
    const { colors } = useTheme()
    const { getColorByKey } = useGetColorByKey()

    return (
        <View
            style={[
                {
                    height: (type === 'horizontal' ? thickness : length) as DimensionValue,
                    width: (type === 'horizontal' ? length : thickness) as DimensionValue,
                    backgroundColor: getColorByKey(color) || colors.outline,
                },
                style,
            ]}
        />
    )
}