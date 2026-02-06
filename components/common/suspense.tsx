import { useTheme } from '@/hooks'
import { useEffect, useRef } from 'react'
import { Animated, Easing, View } from 'react-native'
import ColumnComponent from './column-component'

export default function Suspense({
    height = 180,
    count = 5,
}: {
    height?: number
    count?: number
}) {
    const { colors } = useTheme()
    const opacity = useRef(new Animated.Value(0.2)).current

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.2,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start()
    }, [])

    return (
        <Animated.View style={{ opacity, width: '100%' }}>
            <ColumnComponent gap={5}>
                {[...Array(count)].map((_, index) => (
                    <View
                        key={index}
                        style={{
                            width: '100%',
                            height: height,
                            backgroundColor: colors.cardDisabled,
                            borderRadius: 16,
                            alignSelf: 'stretch',
                        }}
                    />
                ))}
            </ColumnComponent>
        </Animated.View>
    )
}
