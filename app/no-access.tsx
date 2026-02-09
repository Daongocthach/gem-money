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
    <Container headerTitle='no access'>
      <ColumnComponent gap={30}>
        <Overview
          imageSource={IMAGES.LOGIN_BANNER}
          title="log in to level up your projects"
          caption="unlock tools to manage, collaborate, and excel. Take your projects further — smarter and faster"
        >
          <Overview.Banner />
          <Overview.Title />
          <Overview.Caption />
        </Overview>

        <ColumnComponent gap={10}>
          <ButtonComponent
            onPress={() => router.push('/')}
            textProps={{
              text: 'back to home',
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