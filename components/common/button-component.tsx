import { LinearGradient } from 'expo-linear-gradient'
import { ReactNode, useMemo } from "react"
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native"

import { useGetColorByKey } from "@/hooks/use-get-color-by-key"
import { ThemeColorKeys } from '@/types'
import Icon, { IconComponentProps } from "./icon-component"
import TextComponent, { TextComponentProps } from "./text-component"

interface ButtonComponentProps extends TouchableOpacityProps {
  children?: ReactNode
  backgroundColor?: ThemeColorKeys
  disabled?: boolean
  loading?: boolean
  outline?: boolean
  ghost?: boolean
  isIconOnly?: boolean
  isLinearGradient?: boolean
  linearGradientColors?: string[]
  buttonStyle?: TouchableOpacityProps["style"]
  iconProps?: IconComponentProps
  textProps?: TextComponentProps
}

export default function ButtonComponent({
  children,
  backgroundColor = "primary",
  disabled = false,
  loading = false,
  outline = false,
  ghost = false,
  isIconOnly = false,
  isLinearGradient = false,
  linearGradientColors = ['#31cce8', '#6ae1da'],
  buttonStyle,
  iconProps,
  textProps,
  ...props
}: ButtonComponentProps) {
  const { getColorByKey } = useGetColorByKey()

  const { bgColor, borderColor, contentColor, padding, borderWidth } = useMemo(() => {
    const background = (ghost || outline || isIconOnly) ? 'transparent' : getColorByKey(backgroundColor)

    const color = iconProps?.color ? iconProps.color : (ghost || isIconOnly) ? 'icon' : outline ? backgroundColor : 'white'

    return {
      bgColor: background,
      borderColor: getColorByKey(backgroundColor),
      contentColor: getColorByKey(color),
      padding: ghost ? 0 : isIconOnly ? 0 : 12,
      borderWidth: outline ? 1 : 0
    }
  }, [ghost, outline, isIconOnly, getColorByKey, backgroundColor, iconProps?.color])

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      {...props}
    >
      <LinearGradient
        colors={
          isLinearGradient
            ? [linearGradientColors[0], linearGradientColors[1]]
            : [bgColor!, bgColor!]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: isIconOnly ? 0 : 8,
            borderColor: borderColor,
            borderWidth,
            opacity: (disabled || loading) ? 0.6 : 1,
            padding,
          },
          buttonStyle,
        ]}
      >
        {loading ? (
          ghost ? (
            <ActivityIndicator color={contentColor} size={iconProps?.size || 20} />
          ) : (
            <ActivityIndicator color={contentColor} style={{ marginRight: 8 }} />
          )
        ) : (
          iconProps?.name && (
            <Icon
              size={20}
              color={contentColor}
              style={{ marginRight: (textProps?.text || children) ? 6 : 0 }}
              {...iconProps}
            />
          )
        )}
        {textProps?.text && (
          <TextComponent
            color={contentColor ?? "text"}
            text={textProps.text}
            fontWeight={'medium'}
            numberOfLines={1}
            {...textProps}
          />
        )}
        {children}
      </LinearGradient>
    </TouchableOpacity>
  )
}
