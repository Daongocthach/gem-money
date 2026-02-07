import { useRouter } from 'expo-router'
import { useMemo } from 'react'

import ButtonComponent from '@/components/common/button-component'
import CardContainer from '@/components/common/card-container'
import ChipComponent from '@/components/common/chip-component'
import ColumnComponent from '@/components/common/column-component'
import Divider from '@/components/common/divider'
import IconComponent from '@/components/common/icon-component'
import ProgressBar from '@/components/common/progress-bar'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'
import AddTransactionForm from '@/components/transactions/add-transaction-form'

import { useAppBottomSheet } from '@/contexts/bottom-sheet-provider'
import { Jar } from '@/types'
import { formatCurrency, formatK } from '@/utils'

export default function JarCard(jar: Jar) {
    const router = useRouter()
    const { openSheet } = useAppBottomSheet()

    if (!jar) return null

    const {
        name,
        percentage,
        current_balance = 0,
        target_balance,
        color,
        icon,
    } = jar

    const remainingBalance = useMemo(
        () => target_balance - current_balance
        , [target_balance, current_balance]
    )

    const spentPercentage = useMemo(
        () => target_balance > 0
            ? (current_balance / target_balance) * 100
            : 0
        , [target_balance, current_balance]
    )

    const progressValue = useMemo(
        () => {
            if (target_balance <= 0) return 0
            const ratio = current_balance / target_balance
            return ratio > 1 ? 1 : ratio
        },
        [current_balance, target_balance]
    )

    const handleOpenAddTransaction = () => {
        openSheet(
            <AddTransactionForm jarId={jar.id} jarName={jar.name} />,
            ['80%'],
            true
        )
    }

    const handleRoutingTransactions = () => {
        router.push({
            pathname: '/transactions',
            params: { jar_id: jar.id }
        })
    }

    return (
        <CardContainer
            style={{ flex: 1 }}
            backgroundColor={color ? color + 'Container' : undefined}
            onPress={handleRoutingTransactions}
        >
            <ColumnComponent gap={8}>
                <RowComponent justify='space-between' gap={20}>
                    <IconComponent
                        name={icon as any || 'Wallet'}
                        color={color ?? 'primary'}
                        size={24}
                    />
                    <ChipComponent
                        textProps={{
                            text: percentage.toFixed(0) + '%',
                        }}
                        rowProps={{
                            backgroundColor: remainingBalance >= 0 ? color : 'error',
                        }}
                        iconProps={{
                            name: remainingBalance >= 0 ? 'CircleCheckBig' : 'TriangleAlert',
                            size: 12,
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
                        color={
                            remainingBalance >= 0
                                ? (color ?? 'success')
                                : 'error'
                        }
                    />
                </ColumnComponent>

                <Divider color='card' />

                <ColumnComponent gap={10}>
                    <RowComponent justify="space-between" gap={10}>
                        <ColumnComponent style={{ flex: 1 }} gap={4}>
                            <TextComponent
                                text="current"
                                type="caption"
                                size={11}
                            />
                            <TextComponent
                                text={formatK(current_balance)}
                                type="title1"
                                size={11}
                            />
                        </ColumnComponent>

                        <Divider type="vertical" length={25} thickness={1} color='card' />

                        <ColumnComponent style={{ flex: 1, alignItems: 'flex-end' }} gap={4}>
                            <TextComponent
                                text="target"
                                type="caption"
                                size={11}
                            />
                            <TextComponent
                                text={formatK(target_balance)}
                                type="title1"
                                size={11}
                            />
                        </ColumnComponent>
                    </RowComponent>

                    <RowComponent gap={10}>
                        <ProgressBar
                            progress={progressValue}
                            progressColor={
                                remainingBalance >= 0 ?
                                    'success' :
                                    'error'
                            }
                            backgroundColor={'card'}
                        />
                        <TextComponent
                            text={spentPercentage.toFixed(1) + '%'}
                            type='label'
                            size={11}
                        />
                    </RowComponent>

                    <ButtonComponent
                        textProps={{
                            text: 'expense'
                        }}
                        iconProps={{
                            name: 'CirclePlus',
                            size: 14,
                        }}
                        backgroundColor={color}
                        buttonStyle={{
                            padding: 4
                        }}
                        onPress={handleOpenAddTransaction}
                    />
                </ColumnComponent>
            </ColumnComponent>
        </CardContainer>
    )
}