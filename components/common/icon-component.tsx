import { useTheme } from '@/hooks'
import { useGetColorByKey } from '@/hooks/use-get-color-by-key'
import { ThemeColorKeys } from '@/types'
import { icons } from 'lucide-react-native'
import { ViewStyle } from 'react-native'


export type IconComponentProps = {
  name: keyof typeof icons
  color?: ThemeColorKeys
  size?: number
  style?: ViewStyle
}

const IconComponent = ({
  name,
  color,
  size = 24,
  style,
}: IconComponentProps) => {
  const { getColorByKey } = useGetColorByKey()
  const { colors } = useTheme()
  const LucideIcon = icons[name]
  if (!LucideIcon) return null


  return (
    <LucideIcon
      color={color ? getColorByKey(color) : colors.icon}
      width={size}
      height={size}
      style={style}
    />
  )
}

export default IconComponent
