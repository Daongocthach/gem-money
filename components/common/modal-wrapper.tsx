import { useRouter } from "expo-router"
import { Pressable, StyleSheet, View } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { scheduleOnRN } from "react-native-worklets"

import { windowHeight } from "@/constants"
import { useTheme } from "@/hooks"
import { Gesture, GestureDetector } from "react-native-gesture-handler"

export default function ModalWrapper({
  children,
  isFullHeight = false,
}: {
  children: React.ReactNode
  isFullHeight?: boolean
}) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const translateY = useSharedValue(0)
  const panOffsetY = useSharedValue(0)

  const closeModal = () => router.back()

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      minHeight: isFullHeight ? (windowHeight * 0.9 - insets.top) : 0,
      maxHeight: windowHeight * 0.9 - insets.top - translateY.value * 0.35,
    }
  })
  const backdropStyle = useAnimatedStyle(() => {
    const opacity = 0.4 - translateY.value / 1000

    return {
      opacity: opacity < 0 ? 0 : opacity
    }
  })

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = panOffsetY.value + event.translationY
    })
    .onEnd(() => {
      if (translateY.value > 180) {
        scheduleOnRN(closeModal)
      } else {
        translateY.value = 0
      }
    })


  return (
    <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
      <Pressable onPress={closeModal} style={{ ...StyleSheet.absoluteFillObject }}>
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: '#000' },
            backdropStyle
          ]}
        />
      </Pressable>
      <Animated.View
        style={[
          {
            paddingBottom: insets.bottom,
            width: "100%",
            maxHeight: windowHeight * 0.8,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 12,
            backgroundColor: colors.modal,
          },
          animatedStyle
        ]}
      >
        <GestureDetector gesture={panGesture}>
          <View style={{ paddingBottom: 30 }}>
            <View style={{
              width: 50,
              height: 3,
              backgroundColor: colors.icon,
              alignSelf: "center",
              borderRadius: 100,
            }} />
          </View>
        </GestureDetector>
        {children}
      </Animated.View>
    </View>
  )
}
