import { useGetColorByKey } from '@/hooks/use-get-color-by-key'
import { ThemeColorKeys } from '@/types'
import React, { ReactNode } from 'react'
import {
  FlexAlignType,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

export interface RowComponentBaseProps {
  children?: ReactNode
  justify?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  alignItems?: FlexAlignType
  backgroundColor?: ThemeColorKeys
  onPress?: () => void
  wrap?: boolean
  gap?: number
  style?: StyleProp<ViewStyle>
}

type RowComponentProps = RowComponentBaseProps &
  (ViewProps | TouchableOpacityProps)

const RowComponent = React.forwardRef<View, RowComponentProps>(
  (
    {
      children,
      justify = 'flex-start',
      alignItems = 'center',
      backgroundColor,
      onPress,
      style,
      gap = 0,
      wrap = false,
      ...rest
    },
    ref
  ) => {
    const { getColorByKey } = useGetColorByKey() 
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems,
      justifyContent: justify,
      gap,
      flexWrap: wrap ? 'wrap' : 'nowrap',
      backgroundColor: getColorByKey(backgroundColor),
    }

    if (onPress) {
      return (
        <TouchableOpacity
          ref={ref}
          style={[baseStyle, style]}
          onPress={onPress}
          activeOpacity={0.7}
          {...(rest as TouchableOpacityProps)}
        >
          {children ? children : null}
        </TouchableOpacity>
      )
    }

    return (
      <View ref={ref} style={[baseStyle, style]} {...(rest as ViewProps)}>
        {children ? children : null}
      </View>
    )
  }
)

export default RowComponent
