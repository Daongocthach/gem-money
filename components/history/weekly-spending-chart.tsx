import CardContainer from '@/components/common/card-container'
import TextComponent from '@/components/common/text-component'
import { FONT_FAMILIES } from '@/constants'
import { useGetColorByKey, useTheme } from '@/hooks'
import { useDateTimeLabels } from '@/hooks/use-date-time-labels'
import { formatK } from '@/utils'
import { useMemo } from 'react'
import { BarChart } from 'react-native-gifted-charts'


export default function WeeklySpendingChart({
    barChartData,
}: {
    barChartData: number[]
}) {
    const { colors } = useTheme()
    const { getColorByKey } = useGetColorByKey()
    const { dayLabels } = useDateTimeLabels()

    const barData = useMemo(() => {
        if (!barChartData || barChartData.length === 0) return []

        return barChartData.map((value, index) => {
            const label = dayLabels[index]?.short || ''

            return {
                value: value,
                frontColor: getColorByKey('primary'),
                label: label,
                labelComponent: () => (
                    <TextComponent
                        text={label}
                        size={10}
                        textAlign="center"
                        type='title2'
                    />
                ),
                topLabelComponent: () => (
                    <TextComponent
                        text={value > 0 ? formatK(value) : ''}
                        size={9}
                        fontWeight="medium"
                        style={{ marginBottom: 4 }}
                    />
                ),
            }
        })
    }, [barChartData, getColorByKey, dayLabels])


    const maxValue = useMemo(() => {
        const max = barData.length > 0 ? Math.max(...barData.map(d => d.value)) : 0
        return max === 0 ? 100 : max * 1.3
    }, [barData])

    if (!barChartData || barChartData.length === 0) return null

    return (
        <CardContainer isBorder gap={20} style={{ marginTop: 20 }}>
            <TextComponent text="weekly_expenses" type="title2" />
            <BarChart
                data={barData}
                barWidth={30}
                spacing={20}
                initialSpacing={15}
                barBorderRadius={6}
                noOfSections={4}
                yAxisThickness={0}
                xAxisThickness={0}
                rulesType="dashed"
                rulesColor={colors.outline}
                yAxisTextStyle={{ fontSize: 10, fontFamily: FONT_FAMILIES.MEDIUM }}
                formatYLabel={(label) => {
                    const value = Number(label)
                    return formatK(value)
                }}
                isAnimated
                animationDuration={800}
                maxValue={maxValue}
            />
        </CardContainer>
    )
}