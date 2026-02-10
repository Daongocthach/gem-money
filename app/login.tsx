import {
  ButtonComponent,
  CardContainer,
  ColumnComponent,
  Container,
  KeyboardAwareWrapper,
  Overview,
  TextComponent,
  TextInputComponent,
} from "@/components"
import { useRouter } from "expo-router"
import { Controller, useForm } from "react-hook-form"

import { showToast } from "@/alerts"
import IMAGES from "@/assets/images"
import useStore from "@/store"
import { LoginFormInputs } from "@/types"

export default function Login() {
  const router = useRouter()
  const { setActionName } = useStore()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: LoginFormInputs) => {
    setActionName("isLoggedIn", true)
    router.replace("/")
    showToast("login_success")
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
          <Overview.Title />
          <Overview.Caption />
        </Overview>

        <CardContainer outline style={{ marginTop: 20 }}>
          <ColumnComponent gap={24}>
            <ColumnComponent gap={8}>
              <TextComponent text="sign in" type="title1" />
              <TextComponent
                text="sign in with your credentials"
                type="label"
              />
            </ColumnComponent>

            <ColumnComponent gap={16}>
              {/* Email Input */}
              <Controller
                control={control}
                name="email"
                rules={{
                  required: "email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "invalid email format",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputComponent
                    errorMessage={errors.email?.message}
                    mode="outlined"
                  >
                    <TextInputComponent.LeftIcon name="Mail" />
                    <TextInputComponent.Field
                      placeholder="enter your email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    <TextInputComponent.RightGroup>
                      <TextInputComponent.Clear onClear={() => onChange("")} />
                    </TextInputComponent.RightGroup>
                  </TextInputComponent>
                )}
              />

              <Controller
                control={control}
                name="password"
                rules={{
                  required: "password is required",
                  minLength: {
                    value: 3,
                    message: "password must be at least 3 characters",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputComponent
                    errorMessage={errors.password?.message}
                    mode="outlined"
                  >
                    <TextInputComponent.LeftIcon name="Lock" />
                    <TextInputComponent.Field
                      placeholder="enter your password"
                      secureTextEntry
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                    <TextInputComponent.RightGroup>
                      <TextInputComponent.Clear onClear={() => onChange("")} />
                      <TextInputComponent.TogglePassword />
                    </TextInputComponent.RightGroup>
                  </TextInputComponent>
                )}
              />
            </ColumnComponent>

            <ButtonComponent
              onPress={handleSubmit(onSubmit)}
              textProps={{ text: "sign in" }}
            />
          </ColumnComponent>
        </CardContainer>
      </KeyboardAwareWrapper>
    </Container>
  )
}
