import {
  ButtonComponent,
  ColumnComponent,
  Container,
  Overview
} from '@/components'

import IMAGES from '@/assets/images'
import useStore from '@/store'
import { useRouter } from 'expo-router'

export default function NoAccess() {
  const { signOut } = useStore()
  const router = useRouter()


  return (
    <Container headerTitle='no_access'>
      <ColumnComponent gap={30}>
        <Overview
          imageSource={IMAGES.LOGIN_BANNER}
          title="access_denied"
          caption="you_do_not_have_permission_to_access_this_section"
        >
          <Overview.Banner />
          <Overview.Title />
          <Overview.Caption />
        </Overview>

        <ColumnComponent gap={10}>
          <ButtonComponent
            onPress={() => router.push('/')}
            textProps={{
              text: 'back_to_home',
              color: 'onPrimary',
            }}
          />
          <ButtonComponent
            onPress={() => {}}
            textProps={{
              text: 'logout',
            }}
          />
        </ColumnComponent>
      </ColumnComponent>
    </Container>
  )
}