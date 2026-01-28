import React, { ReactNode } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

type AccordionItemProps = {
  isExpanded: boolean
  viewKey: string | number
  children: ReactNode
  style?: ViewStyle
  duration?: number
}

const AccordionItem = ({
  isExpanded,
  viewKey,
  children,
  style,
  duration = 500,
}: AccordionItemProps) => {
  const height = useSharedValue(0)

  const animatedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded), { duration })
  )

  const bodyStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    overflow: 'hidden',
  }))

  return (
    <Animated.View
      key={`accordionItem_${viewKey}`}
      style={[styles.animatedView, bodyStyle, style]}
    >
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height
        }}
        style={styles.wrapper}
      >
        {children}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  animatedView: {
    width: '100%',
  },
  wrapper: {
    position: 'absolute',
    width: '100%',
  },
})

export default AccordionItem
