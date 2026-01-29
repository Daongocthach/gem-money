import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

import CardContainer from '@/components/common/card-container'
import ChipComponent from '@/components/common/chip-component'
import ColumnComponent from '@/components/common/column-component'
import IconComponent from '@/components/common/icon-component'
import ProgressBar from '@/components/common/progress-bar'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'

import { useTheme } from '@/hooks'
import { Jar } from '@/types'

export default function JarCard(jar: Jar) {
    const router = useRouter()
    const { t } = useTranslation()
    const { colors } = useTheme()

    if (!jar) return null

    const {
        name,
        percentage,
        current_balance,
        color,
        icon,
        updated_at
    } = jar

    const formattedBalance = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(current_balance)

    const handleRouting = () => {
    }

    return (
        <CardContainer
            onPress={handleRouting}
            style={{ flex: 1 }}
        >
            <ColumnComponent gap={15}>
                <RowComponent justify='space-between'>
                    <IconComponent
                        name={icon as any || 'Wallet'}
                        color={color}
                        size={24}
                    />
                    <ChipComponent
                        textProps={{
                            text: percentage + '%',
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
                        text={formattedBalance}
                        size={20}
                        fontWeight='bold'
                        color={colors.primary}
                    />
                </ColumnComponent>

                <ColumnComponent gap={8}>
                    <RowComponent justify='space-between'>
                        <TextComponent
                            text={t('100k/125k')}
                            type='label'
                            size={11}
                        />
                        <TextComponent
                            text={percentage.toString() + '%' }
                            type='label'
                            size={11}
                        />
                    </RowComponent>

                    <ProgressBar
                        progress={percentage / 100}
                        progressColor={color}
                        backgroundColor={colors.cardVariant}
                    />
                </ColumnComponent>
            </ColumnComponent>
        </CardContainer>
    )
}