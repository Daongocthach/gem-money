import { useGetColorByKey, useTheme } from "@/hooks"
import { ThemeColorKeys } from "@/types/theme.type"
import React, { ReactNode } from 'react'
import { StyleProp, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'

interface CardContainerProps extends TouchableOpacityProps {
    children?: ReactNode
    style?: StyleProp<ViewStyle>
    blurIntensity?: number
    gap?: number
    isBorder?: boolean
    backgroundColor?: ThemeColorKeys
}

const CardContainer = ({
    children,
    style,
    blurIntensity = 100,
    gap,
    isBorder,
    backgroundColor,
    ...rest
}: CardContainerProps) => {
    const { colors } = useTheme()
    const { getColorByKey } = useGetColorByKey()

    const background = isBorder ?
        'transparent' :
        getColorByKey(backgroundColor)

    return (
        <TouchableOpacity
            {...rest}
            activeOpacity={0.9}
            style={[{
                flexDirection: 'column',
                gap: gap,
                borderWidth: isBorder ? 1 : 0,
                borderColor: colors.outline,
                backgroundColor: background || colors.card,
                padding: 20,
                borderRadius: 30,
                shadowColor: colors.shadow,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
            }, style]}
        >
            {children}
        </TouchableOpacity>
    )
}

export default CardContainer
