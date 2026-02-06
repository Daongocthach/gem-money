import { useTheme } from "@/hooks"
import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Icon, { IconComponentProps } from './icon-component'
import TextComponent, { TextComponentProps } from './text-component'

interface Props {
    textProps?: TextComponentProps
    iconProps?: IconComponentProps
    style?: ViewStyle
}

export default function EmptyComponent({
    textProps = { text: "No data found" },
    iconProps,
    style
}: Props) {
    const insets = useSafeAreaInsets()
    const { colors } = useTheme()

    return (
        <View
            style={[
                styles.container,
                {
                    marginBottom: insets.bottom + 20,
                    borderColor: colors.outlineVariant
                },
                style,
            ]}
        >
            {iconProps && (
                <View style={{ marginBottom: 8 }}>
                    <Icon {...iconProps} />
                </View>
            )}
            <TextComponent
                {...textProps}
                type="body"
                color="icon"
                textAlign="center"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        minHeight: 100,
    },
})