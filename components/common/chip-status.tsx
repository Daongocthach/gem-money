import { View, ViewProps, } from 'react-native'

import { useGetColorByKey } from '@/hooks/use-get-color-by-key'
import { ThemeColorKeys } from '@/types'
import RowComponent, { RowComponentBaseProps } from './row-component'
import TextComponent, { TextComponentProps } from './text-component'

interface ChipStatusProps extends ViewProps {
    size?: number
    statusColor?: ThemeColorKeys
    statusStyle?: ViewProps['style']
    textProps?: TextComponentProps
    rowProps?: RowComponentBaseProps
    onPress?: () => void
}

export default function ChipStatus(props: ChipStatusProps) {
    const { size, statusColor, textProps, rowProps, onPress } = props
    const { getColorByKey } = useGetColorByKey()
    
    return (
        <RowComponent alignItems='center' gap={5} onPress={onPress} {...rowProps}>
            <View
                style={[{
                    width: size || 8,
                    height: size || 8,
                    borderRadius: (size || 8) / 2,
                    backgroundColor: getColorByKey(statusColor),
                }, props.statusStyle]}
            />
            <TextComponent
                {...textProps}
            />
        </RowComponent>
    )
}