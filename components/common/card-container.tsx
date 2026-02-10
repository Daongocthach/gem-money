import { useGetColorByKey, useTheme } from "@/hooks"
import { ThemeColorKeys } from "@/types"
import React, { ReactNode } from 'react'
import {
    StyleProp,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle
} from 'react-native'

interface CardContainerProps extends TouchableOpacityProps {
    children?: ReactNode
    style?: StyleProp<ViewStyle>
    gap?: number
    outline?: boolean
    backgroundColor?: ThemeColorKeys
}

const CardContainer = ({
    children,
    style,
    gap,
    outline = false,
    backgroundColor,
    ...rest
}: CardContainerProps) => {
    const { colors } = useTheme()
    const { getColorByKey } = useGetColorByKey()

    const cardStyle = outline
        ? {
            borderWidth: 1,
            borderColor: colors.outline,
            backgroundColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0,
        }
        : {
            marginTop: 2,
            borderWidth: 0,
            backgroundColor: getColorByKey(backgroundColor) || colors.background,
            shadowColor: colors.shadow || '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
        };

    return (
        <TouchableOpacity
            {...rest}
            activeOpacity={0.9}
            style={[
                {
                    gap: gap,
                    flexDirection: 'column',
                    padding: 20,
                    borderRadius: 10,
                },
                cardStyle,
                style
            ]}
        >
            {children}
        </TouchableOpacity>
    )
}

export default CardContainer