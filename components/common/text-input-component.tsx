import { FONT_FAMILIES } from "@/constants"
import { useTheme } from "@/hooks"
import { icons } from 'lucide-react-native'
import React, { createContext, ReactNode, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native'
import ButtonComponent from './button-component'
import ColumnComponent from './column-component'
import { IconComponentProps } from "./icon-component"
import RowComponent from "./row-component"
import TextComponent from './text-component'

interface TextInputCtxType {
  isFocused: boolean
  setIsFocused: (value: boolean) => void
  showPassword: boolean
  setShowPassword: (value: boolean) => void
  colors: any
  inputValue: string
  setInputValue: (value: string) => void
}

const TextInputCtx = createContext<TextInputCtxType | null>(null)

function useTextInputCtx() {
  const ctx = useContext(TextInputCtx)
  if (!ctx) throw new Error("TextInput sub-components must be used within <TextInputComponent />")
  return ctx
}

const LeftIcon = ({ name, size = 20, onPress }: { name: keyof typeof icons, size?: number, onPress?: () => void }) => {
  const { isFocused, colors } = useTextInputCtx()
  return (
    <View style={styles.leftIcon}>
      <ButtonComponent
        mode="text"
        iconProps={{ name, size, color: isFocused ? colors.primary : colors.icon }}
        onPress={onPress}
      />
    </View>
  )
}

const RightIcon = ({ iconProps, onPress }: { iconProps: IconComponentProps, onPress?: () => void }) => {
  const { isFocused, colors } = useTextInputCtx()
  return (
    <View style={styles.rightIconContainer}>
      <ButtonComponent
        mode="text"
        iconProps={{
          ...iconProps,
          color: iconProps.color || (isFocused ? colors.primary : colors.icon)
        }}
        onPress={onPress}
      />
    </View>
  )
}

const InputField = ({ style, ...props }: TextInputProps) => {
  const { showPassword, setIsFocused, setInputValue, colors } = useTextInputCtx()
  const { t } = useTranslation()

  return (
    <TextInput
      {...props}
      secureTextEntry={props.secureTextEntry && !showPassword}
      placeholder={props.placeholder ? t(props.placeholder) : ''}
      onFocus={(e) => {
        setIsFocused(true)
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        setIsFocused(false)
        props.onBlur?.(e)
      }}
      onChangeText={(text) => {
        setInputValue(text)
        props.onChangeText?.(text)
      }}
      placeholderTextColor={colors.icon}
      style={[
        styles.input,
        { color: colors.onBackground },
        style
      ]}
    />
  )
}

const ClearButton = ({ onClear }: { onClear?: () => void }) => {
  const { inputValue, setInputValue, colors } = useTextInputCtx()
  if (!inputValue) return null
  return (
    <ButtonComponent
      mode="text"
      iconProps={{ name: 'X', size: 18, color: colors.icon }}
      onPress={() => {
        setInputValue('')
        onClear?.()
      }}
    />
  )
}

const TogglePasswordButton = () => {
  const { showPassword, setShowPassword, isFocused, colors } = useTextInputCtx()
  return (
    <ButtonComponent
      mode="text"
      iconProps={{
        name: showPassword ? 'Eye' : 'EyeOff',
        size: 20,
        color: isFocused ? colors.primary : colors.icon
      }}
      onPress={() => setShowPassword(!showPassword)}
    />
  )
}

interface MainProps {
  errorMessage?: string
  children: ReactNode
  containerStyle?: ViewStyle
  mode?: 'flat' | 'outlined'
}

const TextInputComponent = ({
  errorMessage,
  children,
  containerStyle,
  mode = 'outlined',
}: MainProps) => {
  const { colors } = useTheme()
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const isOutlined = mode === 'outlined'

  return (
    <TextInputCtx.Provider value={{
      isFocused, setIsFocused,
      showPassword, setShowPassword,
      colors, inputValue, setInputValue
    }}>
      <ColumnComponent gap={4} style={[styles.container, containerStyle]}>
        <View style={[
          styles.inputWrapper,
          {
            borderColor: errorMessage ? colors.error : (isFocused ? colors.primary : colors.outline),
            borderWidth: isOutlined ? (isFocused || errorMessage ? 1.5 : 1) : 0,
            borderBottomWidth: !isOutlined || isFocused || errorMessage ? 1.5 : 1,
            backgroundColor: colors.background,
          }
        ]}>
          {children}
        </View>

        {errorMessage && (
          <TextComponent
            type='caption'
            text={errorMessage}
            color={colors.error}
          />
        )}
      </ColumnComponent>
    </TextInputCtx.Provider>
  )
}

TextInputComponent.Field = InputField
TextInputComponent.LeftIcon = LeftIcon
TextInputComponent.RightIcon = RightIcon
TextInputComponent.Clear = ClearButton
TextInputComponent.TogglePassword = TogglePasswordButton
TextInputComponent.RightGroup = RowComponent

export default TextInputComponent

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    minHeight: 48,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 8,
    fontSize: 14,
    fontFamily: FONT_FAMILIES.REGULAR,
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIconContainer: {
    marginLeft: 4,
  },
})