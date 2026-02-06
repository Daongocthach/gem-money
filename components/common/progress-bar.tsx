import React from 'react'
import { Animated, View } from 'react-native'

interface ProgressBarProps {
    progress: number
    height?: number
    backgroundColor?: string
    progressColor?: string
}
export default function ProgressBar({
    progress,
    height = 10,
    backgroundColor = '#e5e7eb',
    progressColor = '#818cf8',
}: ProgressBarProps) {
    const widthAnim = new Animated.Value(progress)

    Animated.timing(widthAnim, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
    }).start()

    return (
        <View style={{ height, backgroundColor, borderRadius: 16, overflow: 'hidden' }}>
            <Animated.View
                style={[
                    {
                        height,
                        backgroundColor: progressColor,
                        borderRadius: 16,
                        width: widthAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                        }),
                    },
                ]}
            />
        </View>
    )
}