import { Platform, TouchableOpacity, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTheme } from '@/hooks'
import IconComponent, { IconComponentProps } from './icon-component'

type FloatButtonProps = {
    size?: number
    iconSize?: number
    style?: ViewStyle
    iconProps?: IconComponentProps
    hasBottomTabBar?: boolean
    onPress?: () => void
}

export default function FloatButton ({
    size = 60,
    style,
    iconProps,
    hasBottomTabBar,
    onPress
}: FloatButtonProps) {
    const insets = useSafeAreaInsets()
    const { colors } = useTheme()

    return (
        <TouchableOpacity
            style={[{
                position: 'absolute',
                bottom: insets.bottom + (hasBottomTabBar ? 90 : 30),
                right: 12,
                width: size,
                height: size,
                borderRadius: 30,
                elevation: 4,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Platform.OS === 'android' ? colors.cardDisabled : colors.background
            }, style]}
            onPress={onPress}
        >
            <IconComponent
                name='Plus'
                size={30}
                {...iconProps}
            />
        </TouchableOpacity>
    )
}