import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { BlurView } from 'expo-blur'
import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import TextComponent from '@/components/common/text-component'
import { useTheme } from '@/hooks'
import useStore from '@/store'

export default function BottomTabBarComponent({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { darkMode } = useStore()
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <View
      style={{
        position: 'absolute',
        bottom: insets.bottom + 10,
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: colors.primaryContainer,
      }}
    >
      <BlurView
        intensity={30}
        tint={darkMode ? 'dark' : 'light'}
        experimentalBlurMethod='dimezisBlurView'
        blurReductionFactor={3}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: 'transparent',
          alignItems: 'center',
          paddingVertical: 10,
          borderRadius: 32,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={{
                flex: 1,
                alignItems: 'center',
              }}
            >
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? colors.primary : colors.onCard,
                size: 20,
              })}

              <TextComponent
                text={options.title || route.name}
                color={isFocused ? colors.primary : colors.onCard}
                size={11}
                numberOfLines={1}
              />
            </TouchableOpacity>
          )
        })}
      </BlurView>
    </View>
  )
}