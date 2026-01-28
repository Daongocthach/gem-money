import { DrawerNavigationProp } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import IMAGES from '@/assets/images'
import { useTheme } from "@/hooks"
import ButtonComponent from './button-component'
import ImageComponent from './image-component'
import RowComponent from './row-component'
import TextComponent from './text-component'

type DrawerNav = DrawerNavigationProp<any>

type HeaderProps = {
  title: string,
}

const Header = ({ title }: HeaderProps) => {
  const { colors } = useTheme()
  const { name } = useLocalSearchParams<{ name: string }>()
  const navigation = useNavigation<DrawerNav>()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <RowComponent
      justify='space-between'
      backgroundColor='background'
      style={{
        paddingHorizontal: 12,
        gap: 10,
        paddingTop: insets.top + 10,
        paddingBottom: 15,
      }}
    >
      {router.canGoBack() ? (
        <RowComponent gap={10} style={{ flexShrink: 1 }}>
          <ButtonComponent
            onPress={() => router.back()}
            iconProps={{ name: 'ArrowLeft', size: 25 }}
            backgroundColor='primary'
            buttonStyle={{
              padding: 10,
              borderRadius: 100,
            }}
          />
          <TextComponent
            numberOfLines={1}
            style={{ flexShrink: 1 }}
            text={name ?? title}
            type='title'
          />
        </RowComponent>
      )
        : (
          <ImageComponent
            source={IMAGES.FINEPRO_LOGO}
            style={{ width: 40, height: 40, resizeMode: 'contain' }}
          />
        )}

      {!['notifications', 'profile'].includes(title) && (
        <RowComponent gap={6}>
          <View style={{ position: 'relative' }}>
            <ButtonComponent
              iconProps={{
                name: 'Bell',
                size: 25,
                color: 'onPrimary'
              }}
              backgroundColor='primary'
              buttonStyle={{ padding: 10, borderRadius: 100 }}
              onPress={() => router.push('/notifications')}
            />

            <View
              style={{
                position: 'absolute',
                top: 6,
                right: 9,
                backgroundColor: colors.error,
                borderRadius: 10,
                width: 15,
                height: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >

              <TextComponent
                type='badge'
                size={7}
                color='onPrimary'
                text={'5'}
              />
            </View>
          </View>

          {navigation.openDrawer && (
            <ButtonComponent
              isIconOnly
              iconProps={{ name: 'TextAlignEnd', size: 25 }}
              onPress={() => navigation.openDrawer()}
            />
          )}
        </RowComponent>
      )}
    </RowComponent>
  )
}

export default Header
