import { useGetColorByKey } from '@/hooks/use-get-color-by-key'
import { ThemeColorKeys } from '@/types'
import React, { ReactNode } from 'react'
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native'

export interface ColumnComponentProps {
    children: ReactNode
    alignItems?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'stretch'
    | 'baseline'
    | undefined
    justify?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | undefined
    onPress?: () => void
    gap?: number
    style?: StyleProp<ViewStyle>
    backgroundColor?: ThemeColorKeys
    disabled?: boolean
}

const ColumnComponent = (props: ColumnComponentProps) => {
    const { getColorByKey } = useGetColorByKey()
    const { children, alignItems, justify, onPress, style, gap, backgroundColor, disabled } = props
    const localStyle = [
        {
            backgroundColor: getColorByKey(backgroundColor),
            flexDirection: 'column',
            alignItems: alignItems ?? 'stretch',
            justifyContent: justify ?? 'flex-start',
            gap: gap ?? 0,
        },
        style,
    ] as ViewStyle[]

    return onPress ? (
        <TouchableOpacity
            style={localStyle}
            onPress={onPress ? () => onPress() : undefined}
            disabled={disabled}
        >
            {children}
        </TouchableOpacity>
    ) : (
        <View style={localStyle}>{children}</View>
    )
}

export default ColumnComponent