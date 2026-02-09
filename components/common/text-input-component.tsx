import { useTheme } from "@/hooks"
import { icons } from 'lucide-react-native'
import React, { createContext, ReactNode, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle
} from 'react-native'
import ButtonComponent from './button-component'
import ColumnComponent from './column-component'
import { IconComponentProps } from "./icon-component"
import RowComponent from './row-component'
import TextComponent from './text-component'

interface TextInputCtx {
  isFocused: boolean
  setIsFocused: (value: boolean) => void
  showPassword: boolean
  setShowPassword: (value: boolean) => void
  colors: any
  value: string
  onChangeText: (value: string) => void
  errorMessage?: string
}

const TextInputCtx = createContext<TextInputCtx | null>(null)

function useTextInputCtx() {
  const ctx = useContext(TextInputCtx)
  if (!ctx) throw new Error("TextInput sub-components must be used within <TextInputComponent />")
  return ctx
}


const LeftIcon = ({
  name,
  size = 20,
  onPress
}: {
  name: keyof typeof icons,
  size?: number,
  onPress?: () => void
}) => {
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

const RightIcon = ({
  iconProps,
  onPress
}: {
  iconProps: IconComponentProps
  onPress?: () => void
}) => {
  const { isFocused, colors } = useTextInputCtx()
  const { name, size = 20, color } = iconProps
  return (
    <View style={styles.rightGroup}>
      <ButtonComponent
        mode="text"
        iconProps={{
          name, size,
          color: isFocused ? (color ?? colors.primary) : colors.icon
        }}
        onPress={onPress}
      />
    </View>
  )
}

const RightGroup = ({ children }: { children: ReactNode }) => (
  <RowComponent style={styles.rightGroup} gap={4}>{children}</RowComponent>
)

const ClearButton = () => {
  const { value, onChangeText, colors } = useTextInputCtx()
  if (!value) return null
  return (
    <ButtonComponent
      mode="text"
      iconProps={{ name: 'X', size: 24, color: colors.icon }}
      onPress={() => onChangeText('')}
    />
  )
}

const TogglePasswordButton = () => {
  const { showPassword, setShowPassword, isFocused, colors } = useTextInputCtx()
  return (
    <ButtonComponent
      mode="text"
      iconProps={{
        name: showPassword ? 'EyeOff' : 'Eye',
        size: 20,
        color: isFocused ? colors.primary : colors.icon
      }}
      onPress={() => setShowPassword(!showPassword)}
    />
  )
}


interface MainProps extends TextInputProps {
  label?: string
  errorMessage?: string
  children?: ReactNode
  containerStyle?: ViewStyle
  labelStyle?: TextStyle
  viewStyle?: ViewStyle
  outline?: boolean
}

const TextInputComponent = ({
  label,
  errorMessage,
  children,
  style,
  labelStyle,
  viewStyle,
  outline,
  ...props
}: MainProps) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const value = props.value ?? ''

  const childrenArray = React.Children.toArray(children)

  const leftContent = childrenArray.filter(
    (child: any) => child.type === LeftIcon
  )

  const rightIcon = childrenArray.find((child: any) => child.type === RightIcon)
  const rightGroup = childrenArray.find((child: any) => child.type === RightGroup)

  return (
    <TextInputCtx.Provider value={{
      isFocused, setIsFocused,
      showPassword, setShowPassword,
      colors, value, errorMessage,
      onChangeText: props.onChangeText ?? (() => { })
    }}>
      <ColumnComponent gap={4} style={[styles.container, viewStyle]}>
        {label &&
          <TextComponent
            text={label}
            type="caption"
            style={labelStyle}
          />
        }

        <View style={[
          styles.inputWrapper,
          {
            borderColor: errorMessage ?
              colors.error :
              (isFocused ? colors.primary : colors.outline),
            borderWidth: outline ? (isFocused || errorMessage ? 1.5 : 1) : 0,
            borderBottomWidth: isFocused || errorMessage ? 1.5 : 1,
            backgroundColor: colors.background,
          }
        ]}>

          {leftContent}

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
            placeholderTextColor={colors.icon}
            style={[
              styles.input,
              { color: colors.onBackground, paddingLeft: 12 },
              style
            ]}
          />

          {rightIcon}
          {rightGroup}
        </View>

        {errorMessage &&
          <TextComponent
            type='caption'
            text={errorMessage}
            color='error'
          />
        }
      </ColumnComponent>
    </TextInputCtx.Provider>
  )
}

TextInputComponent.LeftIcon = LeftIcon
TextInputComponent.RightGroup = RightGroup
TextInputComponent.RightIcon = RightIcon
TextInputComponent.Clear = ClearButton
TextInputComponent.TogglePassword = TogglePasswordButton

export default TextInputComponent

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    minHeight: 44,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: 44,
    zIndex: 0,
  },
  leftIcon: {
    paddingLeft: 10
  },
  rightGroup: {
    paddingRight: 10
  },
})