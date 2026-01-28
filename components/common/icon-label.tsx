import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import Icon, { IconComponentProps } from './icon-component'
import RowComponent from './row-component'
import TextComponent, { TextComponentProps } from './text-component'

type IconLabelProps = {
    gap?: number
    style?: StyleProp<ViewStyle>
    label?: string
    textProps?: TextComponentProps
    iconProps?: IconComponentProps
    onPress?: () => void
}

const IconLabel = ({
    gap = 6,
    style,
    label,
    textProps,
    iconProps,
    onPress,
}: IconLabelProps) => {
    return (
        <RowComponent gap={gap} style={style} onPress={onPress}>
            {iconProps && <Icon size={16} {...iconProps} />}

            {label && (
                <TextComponent
                    text={label}
                    numberOfLines={1}
                    {...textProps}
                />
            )}
        </RowComponent>
    )
}

export default IconLabel
