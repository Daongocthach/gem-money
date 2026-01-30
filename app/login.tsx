import {
  ButtonComponent,
  CardContainer,
  ColumnComponent,
  Container,
  KeyboardAwareWrapper,
  Overview,
  TextComponent,
  TextInputComponent
} from '@/components'
import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'

import { showToast } from '@/alerts'
import IMAGES from '@/assets/images'
import useStore from '@/store'
import { LoginFormInputs } from '@/types'

export default function Login() {
  const router = useRouter()
  const { setActionName } = useStore()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormInputs) => {
    setActionName('isLoggedIn', true)
    router.replace('/')
    showToast('login_success')
  }

  return (
    <Container>
      <KeyboardAwareWrapper>
        <Overview
          imageSource={IMAGES.LOGIN_BANNER}
          title="log in to level up your projects"
          caption="unlock tools to manage, collaborate, and excel. Take your projects further — smarter and faster"
        >
          <Overview.Banner />
          <Overview.Title  />
          <Overview.Caption />
        </Overview>
        <CardContainer isBorder style={{ marginTop: 20 }}>
          <ColumnComponent gap={24}>
            <ColumnComponent gap={8}>
              <TextComponent text="sign in" type="title1" />
              <TextComponent
                text="sign in with your credentials"
                type="label"
              />
            </ColumnComponent>

            <ColumnComponent gap={16}>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'invalid email format',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputComponent
                    label="Email Address"
                    placeholder="enter your email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    errorMessage={errors.email?.message}
                  >
                    <TextInputComponent.LeftIcon name="Mail" />
                    <TextInputComponent.RightGroup>
                      <TextInputComponent.Clear />
                    </TextInputComponent.RightGroup>
                  </TextInputComponent>
                )}
              />

              {/* Password Input */}
              <Controller
                control={control}
                name="password"
                rules={{
                  required: 'password is required',
                  minLength: {
                    value: 3,
                    message: 'password must be at least 3 characters',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputComponent
                    label="Password"
                    placeholder="enter your password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={errors.password?.message}
                  >
                    <TextInputComponent.LeftIcon name="Lock" />
                    <TextInputComponent.RightGroup>
                      <TextInputComponent.Clear />
                      <TextInputComponent.TogglePassword />
                    </TextInputComponent.RightGroup>
                  </TextInputComponent>
                )}
              />
            </ColumnComponent>

            {/* Submit Button */}
            <ButtonComponent
              onPress={handleSubmit(onSubmit)}
              textProps={{ text: 'sign in' }}
            />
          </ColumnComponent>
        </CardContainer>
      </KeyboardAwareWrapper>
    </Container>
  )
}