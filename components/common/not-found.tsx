import { useTheme } from '@/hooks'
import { useRouter } from 'expo-router'
import { View, ViewProps } from 'react-native'
import ButtonComponent from './button-component'
import TextComponent from './text-component'

interface NotFoundProps extends ViewProps {
  title?: string
  description?: string
}

const NotFoundScreen = ({
  title = 'page not found',
  description = 'the page you are looking for does not exist or has been moved.',
  ...props
}: NotFoundProps) => {
  const { colors } = useTheme()
  const router = useRouter()

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 40,
          gap: 12,
          backgroundColor: colors.background,
        },
        props.style,
      ]}
      {...props}
    >
      <TextComponent
        text={title}
        type="title"
        textAlign="center"
      />

      <TextComponent
        text={description}
        type="label"
        textAlign="center"
      />

      <ButtonComponent
        textProps={{ text: 'back' }}
        onPress={() => router.replace('/')}
        style={{ marginTop: 20, width: '100%' }}
      />
    </View>
  )
}

export default NotFoundScreen
