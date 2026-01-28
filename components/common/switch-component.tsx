import { View } from 'react-native'

import { useTheme } from '@/hooks'
import ColumnComponent from './column-component'
import TextComponent from './text-component'

export default function SwitchComponent({
    value,
    onToggle,
    label,
    textTrue = 'yes',
    textFalse = 'no',
    disabled,
}: {
    value: boolean
    label?: string
    textTrue?: string
    textFalse?: string
    onToggle: () => void
    disabled?: boolean
}) {
    const { colors } = useTheme()
    const switchText = value ? textTrue : textFalse

    return (
        <ColumnComponent gap={4} onPress={onToggle} disabled={disabled} alignItems='flex-start'>
            {label && (
                <TextComponent
                    text={label}
                    type="label"
                />
            )}
            <View
                style={{
                    backgroundColor: value ? colors.primary : colors.outline,
                    paddingHorizontal: 12,
                    minHeight: 30,
                    borderRadius: 30,
                    paddingVertical: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    position: 'relative',
                }}
            >
                <TextComponent
                    text={switchText}
                    color={value ? 'onPrimary' : 'onCard'}
                    style={{
                        fontSize: 14,
                        marginRight: value ? 24 : 0,
                        marginLeft: value ? 0 : 24,
                    }}
                />

                <View
                    style={{
                        backgroundColor: 'white',
                        right: value ? 4 : undefined,
                        left: value ? undefined : 4,
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        position: 'absolute',
                        top: 4,
                    }}
                />
            </View>
        </ColumnComponent>
    )
}