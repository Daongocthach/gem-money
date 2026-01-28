import { ReactNode } from 'react'
import { ScrollView, View, ViewStyle } from 'react-native'
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated'
import { SafeAreaViewProps } from 'react-native-safe-area-context'

import { useTheme } from '@/hooks'
import Header from './header'
import WaveBackground from './wave-background'

interface Props extends SafeAreaViewProps {
  children: ReactNode
  isScroll?: boolean
  style?: ViewStyle
  contentContainerStyle?: ViewStyle
  animation?: 'fade' | 'slide' | 'none'
  headerTitle?: string
}

const Container = ({
  children,
  isScroll,
  style,
  contentContainerStyle,
  animation = 'slide',
  headerTitle,
  ...props
}: Props) => {
  const { colors } = useTheme()

  const renderContent = () => (
    isScroll ? (
      <ScrollView
        contentContainerStyle={[{
          paddingHorizontal: 0,
          flex: 1,
        }, contentContainerStyle]}
      >
        {children}
      </ScrollView>
    ) : (
      <View style={[{ flex: 1 }, style]}>
        {children}
      </View>
    )
  )

  const entering =
    animation === 'fade' ? FadeInRight.duration(250) : FadeInRight.duration(500)
  const exiting =
    animation === 'fade' ? FadeOutLeft.duration(200) : FadeOutLeft.duration(250)

  return (
    <View style={{ flex: 1 }}>
      {headerTitle && <Header title={headerTitle} />}
      <Animated.View
        entering={entering}
        exiting={exiting}
        style={{
          flex: 1,
          paddingHorizontal: 12,
          backgroundColor: colors.background
        }}
        {...props}
      >
        <WaveBackground />
        {renderContent()}
      </Animated.View>
    </View>
  )
}

export default Container
