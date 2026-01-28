import { icons } from 'lucide-react-native'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  TextInput,
  TextInputProps,
  View,
  ViewStyle
} from 'react-native'

import { useTheme } from "@/hooks"
import ButtonComponent from './button-component'
import ColumnComponent, { ColumnComponentProps } from './column-component'
import RowComponent from './row-component'
import TextComponent from './text-component'

interface CustomTextInputProps extends TextInputProps {
  style?: TextInputProps['style']
  isPassword?: boolean
  errorMessage?: string
  isDropdown?: boolean
  hideClear?: boolean
  hideBorder?: boolean
  onClear?: () => void
  leftIcon?: keyof typeof icons
  leftIconSize?: number
  onPressInLeftIcon?: () => void
  onPressInRightIcon?: () => void
  rightIcon?: keyof typeof icons
  rightIconSize?: number
  label?: string
  viewStyle?: ViewStyle
  borderRadius?: number
  columnProps?: ColumnComponentProps
}

const TextInputComponent = ({
  isPassword = false,
  isDropdown = false,
  hideClear = false,
  hideBorder = false,
  onClear,
  errorMessage,
  leftIcon,
  leftIconSize = 20,
  onPressInLeftIcon,
  onPressInRightIcon,
  rightIcon,
  rightIconSize = 20,
  style,
  viewStyle,
  label,
  borderRadius = 8,
  columnProps,
  ...props
}: CustomTextInputProps) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const focusBorderColor = isFocused ? colors.primary : colors.outline
  const focusIconColor = isFocused ? colors.primary : colors.icon

  const canShowClear = !hideClear &&
    typeof props.value === 'string' &&
    props.value.length > 0 &&
    props.editable !== false

  const handleClear = () => {
    if (onClear) {
      onClear()
    } else {
      props.onChangeText?.('')
    }
  }

  return (
    <ColumnComponent {...columnProps} gap={4} style={{ flexGrow: 1, flexShrink: 1 }}>
      {label && (
        <TextComponent
          text={label}
          type="label"
        />
      )}
      <View style={[{
        position: 'relative',
        borderWidth: hideBorder ? 0 : (isFocused ? 1.5 : 1),
        borderRadius: borderRadius,
        borderColor: focusBorderColor,
        overflow: 'hidden',
      }, viewStyle]}>
        <TextInput
          {...props}
          allowFontScaling={false}
          underlineColorAndroid="transparent"
          placeholderTextColor={colors.icon}
          secureTextEntry={isPassword && !showPassword}
          value={props.value}
          placeholder={t(props.placeholder ?? '')}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          style={[
            {
              flexGrow: 1,
              color: colors.onBackground,
              backgroundColor: colors.background,
              height: 44,
              paddingRight:
                (rightIcon || isPassword)
                  ? (canShowClear ? 40 : 50)
                  : (canShowClear ? 40 : 12),
              paddingLeft: leftIcon ? 40 : 12,
              borderRadius: 8,
            },
            style,
          ]}
        />

        <RowComponent style={{ position: 'absolute', left: 10, height: "100%" }} gap={5}>
          {leftIcon && (
            <ButtonComponent
              isIconOnly
              iconProps={{ name: leftIcon, size: leftIconSize, color: focusIconColor }}
              onPress={onPressInLeftIcon}
            />
          )}
        </RowComponent>

        <RowComponent style={{ position: 'absolute', right: 10, height: "100%" }} gap={5}>
          <ButtonComponent
            onPress={handleClear}
            isIconOnly
            iconProps={{ name: "X" }}
            style={{
              opacity: canShowClear ? 1 : 0,
              pointerEvents: canShowClear ? 'auto' : 'none',
            }}
          />
          {rightIcon && (
            <ButtonComponent
              isIconOnly
              iconProps={{
                name: rightIcon,
                size: rightIconSize,
                color: focusIconColor
              }}
              onPress={onPressInRightIcon}
            />
          )}
          {isPassword && (
            <ButtonComponent
              isIconOnly
              iconProps={{
                name: showPassword ? 'EyeOff' : 'Eye',
                size: 18,
                color: focusIconColor
              }}
              onPress={(() => setShowPassword(!showPassword))}
            />
          )}
        </RowComponent>
      </View>

      {errorMessage && (
        <TextComponent
          type='caption'
          text={errorMessage}
          color='error'
        />
      )}
    </ColumnComponent>
  )
}

export default TextInputComponent
