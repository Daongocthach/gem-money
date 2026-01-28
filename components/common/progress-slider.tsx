import { useTheme } from '@/hooks'
import Slider from '@react-native-community/slider'
import { Platform, View } from 'react-native'
import RowComponent from './row-component'
import TextComponent from './text-component'

type Props = {
    percent: number
    setPercent: (value: number) => void
}

export default function ProgressSlider({
    percent,
    setPercent,
}: Props) {
    const { colors } = useTheme()

    return (
        <View style={{ width: '100%' }}>
            <RowComponent
                justify='space-between'
                style={{
                    paddingHorizontal: Platform.OS === 'ios' ? 0 : 10
                }}>
                <TextComponent text="progress" type='label' />
                <TextComponent text={`${Math.round(percent)}%`} type='label' />
            </RowComponent>
            <Slider
                value={percent}
                onValueChange={setPercent}
                minimumValue={0}
                maximumValue={100}
                step={1}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.icon}
                thumbTintColor={colors.primary}
                style={{
                    height: 40,
                }}
            />
        </View>
    )
}
