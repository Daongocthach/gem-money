import { useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'

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

import { showToast } from '@/alerts'
import IMAGES from '@/assets/images'
import useStore from '@/store'
import { LoginFormInputs } from '@/types'

export default function Login() {
  const router = useRouter()
  const { signIn, setActionName, isLoggedIn } = useStore()
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

  // const { mutate: login, isPending } = useMutation({
  //   mutationFn: (data: LoginFormInputs) => authenApi.login(data),
  //   onSuccess: (response) => {
  //     showToast('login_success')
  //     router.replace('/')
  //   },
  //   onError: (error: AxiosError<any>) => {
  //     const res = error.response?.data
  //     if (!res) return

  //     if (res.data?.is_locked) {
  //       router.push({
  //         pathname: '/locked',
  //         params: res.data,
  //       })
  //     }
  //   }
  // })

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
        />
        <CardContainer isBorder style={{ marginTop: 20 }}>
          <ColumnComponent gap={20}>
            <ColumnComponent gap={10}>
              <TextComponent text="sign in" type="title1" />
              <TextComponent
                text="sign in with your credentials"
                type="label"
              />
            </ColumnComponent>
            <ColumnComponent gap={10}>
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
                    placeholder="enter your email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    errorMessage={errors.email?.message}
                  />
                )}
              />
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
                    placeholder="enter your password"
                    isPassword
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    errorMessage={errors.password?.message}
                  />
                )}
              />

            </ColumnComponent>

            <ButtonComponent
              onPress={handleSubmit(onSubmit)}
              // loading={isPending}
              textProps={{ text: 'sign in' }}
            />
          </ColumnComponent>
        </CardContainer>
      </KeyboardAwareWrapper>
    </Container>
  )
}