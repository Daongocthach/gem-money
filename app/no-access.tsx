import {
  ButtonComponent,
  ColumnComponent,
  Container,
  Overview
} from '@/components'

import IMAGES from '@/assets/images'
import { useRouter } from 'expo-router'

export default function NoAccess() {
  const router = useRouter()


  return (
    <Container headerTitle='no access'>
      <ColumnComponent gap={30}>
        <Overview
          imageSource={IMAGES.LOGIN_BANNER}
          title="you don't have access"
          caption="contact administrator for more information"
        />

        <ColumnComponent gap={10}>
          <ButtonComponent
            onPress={() => router.back()}
            textProps={{
              text: 'back to home',
              color: 'onPrimary',
            }}
          />
          <ButtonComponent
            outline
            onPress={() => router.back()}
            textProps={{
              text: 'logout',
            }}
          />
        </ColumnComponent>
      </ColumnComponent>
    </Container>
  )
}