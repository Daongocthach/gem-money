
import ButtonComponent from '@/components/common/button-component'
import CardContainer from '@/components/common/card-container'
import ColumnComponent from '@/components/common/column-component'
import ProgressBar from '@/components/common/progress-bar'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'

import { useAppBottomSheet } from '@/contexts/bottom-sheet-provider'
import { useTheme } from '@/hooks'
import { Jar } from '@/types'
import { formatCurrency, formatK } from '@/utils'

export default function JarCard(jar: Jar) {
    const { colors } = useTheme()
    const { openSheet, closeSheet } = useAppBottomSheet()

    if (!jar) return null

    const {
        name,
        percentage,
        current_balance = 0,
        target_balance,
        color,
        icon,
    } = jar

    const remainingBalance = formatCurrency(target_balance - current_balance)

    const spentPercentage = target_balance > 0
        ? (current_balance / target_balance) * 100
        : 0

    const progressValue = Math.min(Math.max(spentPercentage / 100, 0), 1)



    return (
        <CardContainer style={{ flex: 1 }} >
            <ColumnComponent gap={15}>
                <RowComponent justify='space-between' gap={20}>
                    <ButtonComponent
                        isIconOnly
                        textProps={{
                            text: percentage + '%',
                            type: 'title2',
                            fontWeight: 'semibold'
                        }}
                        iconProps={{
                            name: icon as any || 'Wallet',
                            color: color ?? 'primary',
                            size: 20,
                        }}
                    />
                    <ButtonComponent
                        isIconOnly
                        iconProps={{
                            name: 'CircleFadingPlus',
                            color: color ?? 'primary',
                            size: 20,
                        }}
                    />
                </RowComponent>

                <ColumnComponent gap={5}>
                    <TextComponent
                        text={name}
                        type="title1"
                        fontWeight='bold'
                    />
                    <TextComponent
                        text={formatCurrency(remainingBalance)}
                        size={20}
                        fontWeight='bold'
                        color={colors.primary}
                    />
                </ColumnComponent>

                <ColumnComponent gap={8}>
                    <RowComponent justify='space-between'>
                        <TextComponent
                            text={formatK(current_balance) +
                                ' / ' +
                                formatK(target_balance)}
                            type='label'
                            size={11}
                        />
                        <TextComponent
                            text={spentPercentage + '%'}
                            type='label'
                            size={11}
                        />
                    </RowComponent>
                    <ProgressBar
                        progress={progressValue}
                        progressColor={color}
                        backgroundColor={colors.cardVariant}
                    />
                </ColumnComponent>
            </ColumnComponent>
        </CardContainer>
    )
}