import { useGetColorByKey } from '@/hooks'
import { ThemeColorKeys } from '@/types'
import React from 'react'
import { Animated, View } from 'react-native'

interface ProgressBarProps {
    progress: number
    height?: number
    backgroundColor?: ThemeColorKeys
    progressColor?: ThemeColorKeys
}
export default function ProgressBar({
    progress,
    height = 10,
    backgroundColor = 'card',
    progressColor = 'primary',
}: ProgressBarProps) {
    const { getColorByKey } = useGetColorByKey()
    const widthAnim = new Animated.Value(progress)

    Animated.timing(widthAnim, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
    }).start()

    return (
        <View style={{
            height,
            backgroundColor: getColorByKey(backgroundColor),
            borderRadius: 16,
            overflow: 'hidden',
            flex: 1
        }}>
            <Animated.View
                style={[
                    {
                        height,
                        backgroundColor: getColorByKey(progressColor),
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