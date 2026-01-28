import { useRouter } from "expo-router"
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native"

import { windowHeight } from "@/constants"
import { useTheme } from "@/hooks"

export default function AlertModalWrapper({
    children,
    keyboardOffset = 0
}: {
    children: React.ReactNode,
    keyboardOffset?: number
}) {
    const { colors } = useTheme()
    const router = useRouter()

    const closeModal = () => router.back()

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }} >
                <Pressable
                    onPress={closeModal}
                    style={StyleSheet.absoluteFillObject}
                >
                    <View
                        style={[
                            StyleSheet.absoluteFillObject,
                            {
                                backgroundColor: colors.backdrop,
                            }
                        ]}
                    />
                </Pressable>

                <View
                    style={{
                        padding: 12,
                        backgroundColor: colors.background,
                        width: "90%",
                        minHeight: 200,
                        maxHeight: windowHeight * 0.8,
                        paddingBottom: 12,
                        borderRadius: 16,
                        transform: [{ translateY: -keyboardOffset }],
                    }}
                >
                    {children}
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}