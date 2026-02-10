import Slider from '@react-native-community/slider'
import React from 'react'
import { TouchableOpacity } from 'react-native'

import CardContainer from '@/components/common/card-container'
import ColumnComponent from '@/components/common/column-component'
import IconComponent from '@/components/common/icon-component'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'
import { Jar } from '@/types'

interface Props {
    jar: Jar
    onPercentageChange: (value: number) => void
    onDelete?: () => void
}

export default function DistributionJarCard({ jar, onPercentageChange, onDelete }: Props) {
    if (!jar) return null

    const {
        name,
        percentage,
        color,
        icon,
    } = jar

    return (
        <CardContainer>
            <ColumnComponent gap={16}>
                <RowComponent justify="space-between" >
                    <RowComponent gap={12} style={{ flex: 1 }}>
                        <CardContainer
                            backgroundColor={color ? `${color}Container` : 'primaryContainer'}
                            style={{ padding: 8, borderRadius: 12 }}
                        >
                            <IconComponent
                                name={icon as any || 'Wallet'}
                                color={color ?? 'primary'}
                                size={24}
                            />
                        </CardContainer>

                        <ColumnComponent>
                            <TextComponent
                                text={name}
                                fontWeight="bold"
                                size={16}
                            />
                            <TextComponent
                                text="Description category"
                                size={12}
                                color="gray"
                            />
                        </ColumnComponent>
                    </RowComponent>

                    <TouchableOpacity onPress={onDelete} activeOpacity={0.7}>
                        <IconComponent name="Trash2" color="outline" size={20} />
                    </TouchableOpacity>
                </RowComponent>

                <RowComponent gap={10}>
                    <Slider
                        style={{ flex: 1, height: 40 }}
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        value={percentage}
                        onValueChange={onPercentageChange}
                        minimumTrackTintColor={color ? `${color}` : '#3B82F6'}
                        maximumTrackTintColor="#F3F4F6"
                        thumbTintColor={color ? `${color}` : '#3B82F6'}
                    />

                    <TextComponent
                        text={`${percentage}%`}
                        fontWeight="bold"
                        size={18}
                        style={{ minWidth: 45, textAlign: 'right' }}
                    />
                </RowComponent>
            </ColumnComponent>
        </CardContainer>
    )
}