import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native'

import { FONT_FAMILIES } from '@/constants'
import { useGetColorByKey, useTheme } from '@/hooks'
import i18next from '@/locales'
import { ThemeColorKeys } from '@/types'

type TextType =
  | 'display'
  | 'title'
  | 'title1'
  | 'title2'
  | 'body'
  | 'caption'
  | 'label'
  | 'link'
  | 'badge'

export interface TextComponentProps extends TextProps {
  children?: React.ReactNode
  style?: StyleProp<TextStyle>
  text?: string
  size?: number
  color?: ThemeColorKeys
  fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold'
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify'
  type?: TextType
}

const TextComponent = ({
  children,
  style,
  text,
  size,
  fontWeight,
  type = 'body',
  textAlign,
  color,
  ...props
}: TextComponentProps) => {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const { getColorByKey } = useGetColorByKey()

  const getFontFamily = (fontFamily: typeof fontWeight) => {
    switch (fontFamily) {
      case 'medium':
        return FONT_FAMILIES.MEDIUM
      case 'semibold':
        return FONT_FAMILIES.SEMIBOLD
      case 'bold':
        return FONT_FAMILIES.BOLD
      default:
        return FONT_FAMILIES.REGULAR
    }
  }

  const resolvedColor =
    color
      ? getColorByKey(color)
      : ['caption', 'label'].includes(type)
        ? colors.icon
        : colors.text

  return (
    <Text
      {...props}
      allowFontScaling={false}
      style={[
        styles[type],
        {
          color: resolvedColor,
          textAlign: textAlign ?? 'left',
          includeFontPadding: false, 
          textAlignVertical: 'center',
          ...(fontWeight ? { fontFamily: getFontFamily(fontWeight) } : {}),
          ...(size ? { fontSize: size } : {}),
        },
        style,
      ]}
    >
      {text
        ? (i18next.exists(text) ? t(text) : text)
        : children}
    </Text>
  )
}

export default TextComponent

const styles = StyleSheet.create({
  display: {
    fontSize: 20,
    fontFamily: FONT_FAMILIES.SEMIBOLD,
  },
  title: {
    fontSize: 18,
    fontFamily: FONT_FAMILIES.SEMIBOLD,
  },
  title1: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.SEMIBOLD,
  },
  title2: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: FONT_FAMILIES.MEDIUM,
  },
  body: {
    fontSize: 13,
    fontFamily: FONT_FAMILIES.REGULAR,
  },
  label: {
    fontSize: 13,
    fontFamily: FONT_FAMILIES.MEDIUM,
  },
  link: {
    fontSize: 13,
    fontFamily: FONT_FAMILIES.REGULAR,
    textDecorationLine: 'underline',
  },
  caption: {
    fontSize: 12,
    fontFamily: FONT_FAMILIES.REGULAR,
  },
  badge: {
    fontSize: 7,
    lineHeight: 10,
    fontFamily: FONT_FAMILIES.MEDIUM,
  },
})
