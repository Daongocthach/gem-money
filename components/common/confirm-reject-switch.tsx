import { useTheme } from '@/hooks'
import { ConfirmState } from '@/types'
import { Pressable, View } from 'react-native'
import RowComponent from './row-component'
import TextComponent from './text-component'

export default function ConfirmRejectSwitch({
    value,
    onChange,
    disabled,
}: {
    value: ConfirmState
    onChange: (value: ConfirmState) => void
    disabled?: boolean
}) {
    const { colors } = useTheme()

    const bgColor =
        value === 'rejected'
            ? colors.error
            : value === 'confirmed'
            ? colors.success
            : colors.outline

    return (
        <RowComponent gap={8} alignItems="center">
            <TextComponent text="rejected" color="error" />

            <View
                style={{
                    width: 64,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: bgColor,
                    flexDirection: 'row',
                    overflow: 'hidden',
                }}
            >
                <Pressable
                    disabled={disabled}
                    style={{ flex: 1 }}
                    onPress={() => onChange('rejected')}
                />

                <Pressable
                    disabled={disabled}
                    style={{ flex: 1 }}
                    onPress={() => onChange('confirmed')}
                />

                <View
                    pointerEvents="none"
                    style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: '#fff',
                        position: 'absolute',
                        top: 3,
                        left:
                            value === 'rejected'
                                ? 4
                                : value === 'confirmed'
                                ? 64 - 22 - 4
                                : (64 - 22) / 2,
                    }}
                />
            </View>

            <TextComponent text="confirmed" color="success" />
        </RowComponent>
    )
}
