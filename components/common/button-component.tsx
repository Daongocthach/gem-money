import { ReactNode, useMemo } from "react"
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native"

import { useTheme } from "@/hooks"
import { useGetColorByKey } from "@/hooks/use-get-color-by-key"
import { ThemeColorKeys } from '@/types'
import Icon, { IconComponentProps } from "./icon-component"
import TextComponent, { TextComponentProps } from "./text-component"

interface ButtonComponentProps extends TouchableOpacityProps {
  children?: ReactNode
  backgroundColor?: ThemeColorKeys
  disabled?: boolean
  loading?: boolean
  mode?: "contained" | "outlined" | "text"
  buttonStyle?: TouchableOpacityProps["style"]
  iconProps?: IconComponentProps
  rightIconProps?: IconComponentProps
  textProps?: TextComponentProps
}

export default function ButtonComponent({
  children,
  backgroundColor = "primary",
  disabled = false,
  loading = false,
  mode = "contained",
  buttonStyle,
  iconProps,
  rightIconProps,
  textProps,
  ...props
}: ButtonComponentProps) {
  const { getColorByKey } = useGetColorByKey()
  const { colors } = useTheme()

  const styles = useMemo(() => {
    const mainColor = getColorByKey(backgroundColor)

    const config = {
      contained: {
        bg: mainColor ?? colors.primary,
        border: 0,
        content: colors.onPrimary,
        padding: 12,
      },
      outlined: {
        bg: "transparent",
        border: 1,
        content: mainColor ?? colors.primary,
        padding: 12,
      },
      text: {
        bg: "transparent",
        border: 0,
        content: mainColor ?? colors.text,
        padding: 0,
      }
    }

    const currentVariant = config[mode]

    return {
      backgroundColor: currentVariant.bg,
      borderColor: mainColor,
      borderWidth: currentVariant.border,
      contentColor: iconProps?.color ? getColorByKey(iconProps.color) : currentVariant.content,
      padding: currentVariant.padding,
    }
  }, [mode, backgroundColor, getColorByKey, iconProps?.color])


  return (
    <TouchableOpacity
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: styles.padding,
          borderRadius: 12,
          backgroundColor: styles.backgroundColor,
          borderWidth: styles.borderWidth,
          borderColor: styles.borderColor,
          opacity: (disabled || loading) ? 0.5 : 1,
        },
        buttonStyle,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={styles.contentColor} size="small" />
      ) : (
        <>
          {iconProps?.name && (
            <Icon
              size={iconProps?.size || 20}
              color={styles.contentColor}
              style={{ marginRight: (textProps?.text || children) ? 8 : 0 }}
              {...iconProps}
            />
          )}

          {textProps?.text && (
            <TextComponent
              color={styles.contentColor as ThemeColorKeys}
              text={textProps.text}
              fontWeight={'semibold'}
              numberOfLines={1}
              {...textProps}
            />
          )}

          {children}

          {rightIconProps?.name && (
            <Icon
              size={rightIconProps?.size || 20}
              color={styles.contentColor}
              style={{ marginLeft: (textProps?.text || children) ? 8 : 0 }}
              {...rightIconProps}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  )
}