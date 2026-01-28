import { useTheme } from '@/hooks'
import { Check } from 'lucide-react-native'
import { TouchableOpacity, View } from 'react-native'

interface CheckboxProps {
  checked?: boolean
  setChecked?: (checked: boolean) => void
  style?: object
  tickColor?: string
}

export default function Checkbox({
  checked,
  setChecked,
  style,
  tickColor,
}: CheckboxProps) {
  const { colors } = useTheme()
  return (
    <TouchableOpacity
      onPress={() => setChecked && setChecked(!checked)}
      style={[{
        flexDirection: 'row',
        alignItems: 'center',
      }, style]}
    >
      <View
        style={{
          width: 24,
          height: 24,
          backgroundColor: checked ? colors.primary : colors.background,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 3,
        }}
      >
        {checked && (
          <Check size={16} color={tickColor ? tickColor : colors.onPrimary} strokeWidth={3} />
        )}
      </View>
    </TouchableOpacity>
  )
}
