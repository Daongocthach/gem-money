import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React, { useEffect, useState } from 'react'
import { LayoutChangeEvent, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import TextComponent from '@/components/common/text-component'
import { useTheme } from '@/hooks'

export default function BottomTabBarComponent({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const windowWidth = useWindowDimensions().width

  const [dimensions, setDimensions] = useState({ height: 0, width: 0 })

  const PADDING = 5
  const numTabs = state.routes.length

  const dynamicContainerWidth = (windowWidth * Math.min(numTabs * 22, 90)) / 100

  const buttonWidth = dimensions.width / numTabs

  const indicatorHeight = dimensions.height - PADDING * 2
  const indicatorWidth = buttonWidth - PADDING * 2

  const tabPositionX = useSharedValue(0)

  useEffect(() => {
    if (dimensions.width > 0) {
      tabPositionX.value = withSpring(state.index * buttonWidth + PADDING, {
        duration: 500,
        dampingRatio: 0.8,
      })
    }
  }, [state.index, buttonWidth])

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    })
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    }
  })

  return (
    <View
      onLayout={onTabbarLayout}
      style={[
        styles.container,
        {
          bottom: insets.bottom + 20,
          backgroundColor: colors.background,
          width: dynamicContainerWidth,
        },
      ]}
    >
      {dimensions.width > 0 && (
        <Animated.View
          style={[
            animatedStyle,
            {
              position: 'absolute',
              backgroundColor: colors.primary,
              borderRadius: 28,
              height: indicatorHeight,
              width: indicatorWidth,
              top: PADDING,
            },
          ]}
        />
      )}

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.tabItem, { width: buttonWidth }]}
          >
            <View style={styles.contentWrapper}>
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? colors.onPrimary : colors.onCard,
                size: isFocused ? 30 : 24,
              })}

              {!isFocused &&
                <TextComponent
                  text={options.title || route.name}
                  color={isFocused ? colors.onPrimary : colors.onCard}
                  type="title2"
                  size={12}
                  numberOfLines={1}
                />
              }
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 35,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    alignItems: 'center',
    height: 65,
  },
  tabItem: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
})