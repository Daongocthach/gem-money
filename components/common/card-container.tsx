import { useTheme } from "@/hooks"
import useStore from '@/store'
import React, { ReactNode } from 'react'
import { StyleProp, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'

interface CardContainerProps extends TouchableOpacityProps {
    children?: ReactNode
    cardColor?: string
    style?: StyleProp<ViewStyle>
    blurIntensity?: number
    gap?: number
    isBorder?: boolean
}

const CardContainer = ({
    children,
    style,
    cardColor,
    blurIntensity = 100,
    gap,
    isBorder,
    ...rest
}: CardContainerProps) => {
    const { darkMode } = useStore()
    const { colors } = useTheme()

    return (
        <TouchableOpacity
            {...rest}
            activeOpacity={0.9}
            style={[{
                flexDirection: 'column',
                gap: gap,
                borderWidth: isBorder ? 1 : 0,
                borderColor: colors.outline,
                backgroundColor: isBorder ? 'transparent' : colors.card,
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
