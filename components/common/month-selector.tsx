import { useLocale, useTheme } from '@/hooks'
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    format,
    isSameDay,
    startOfMonth,
    subMonths
} from 'date-fns'
import React, { useMemo, useRef, useState } from 'react'
import { FlatList } from 'react-native'
import ButtonComponent from './button-component'
import ColumnComponent from './column-component'
import DateTimePickerModal from './date-time-picker-modal'
import RowComponent from './row-component'
import TextComponent from './text-component'

export default function MonthSelector({
    selectedDate,
    setSelectedDate,
}: {
    selectedDate: Date
    setSelectedDate: (date: Date) => void
}) {
    const { locale } = useLocale()
    const { colors } = useTheme()
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [modalVisible, setModalVisible] = useState(false)
    const [tempDate, setTempDate] = useState<Date>(selectedDate)

    const flatListRef = useRef<FlatList<Date>>(null)

    const daysInMonth = useMemo(() => {
        const start = startOfMonth(currentMonth)
        const end = endOfMonth(currentMonth)
        return eachDayOfInterval({ start, end })
    }, [currentMonth])

    const changeMonth = (offset: 'next' | 'prev') => {
        const newMonth = offset === 'next' ?
            addMonths(currentMonth, 1) :
            subMonths(currentMonth, 1)

        setCurrentMonth(newMonth)
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
    }

    const openPicker = () => {
        setTempDate(selectedDate)
        setModalVisible(true)
    }

    const onCancel = () => {
        setModalVisible(false)
    }

    const onConfirm = () => {
        setModalVisible(false)
        setSelectedDate(new Date(tempDate))
    }

    const renderItem = ({ item }: { item: Date }) => {
        const isSelected = isSameDay(item, selectedDate)
        const dayName = format(item, 'EEEEEE', { locale: locale })

        return (
            <ColumnComponent
                gap={10}
                alignItems='center'
                style={{ marginRight: 20 }}
                onPress={() => setSelectedDate(item)}
            >
                <TextComponent
                    text={dayName.toUpperCase()}
                    type='label'
                    size={12}
                />

                <ButtonComponent
                    buttonStyle={{
                        padding: 0,
                        width: 35,
                        height: 35,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100,
                    }}
                    textProps={{
                        text: format(item, 'd'),
                        color: isSelected ? colors.onPrimary : colors.text,
                        type: 'label',
                        fontWeight: 'semibold',
                    }}
                    backgroundColor={isSelected ? colors.primary : 'transparent'}
                    onPress={() => setSelectedDate(item)}
                />
            </ColumnComponent>
        )
    }

    return (
        <ColumnComponent gap={20}>
            <RowComponent justify='space-between'>
                <ButtonComponent
                    mode="text"
                    iconProps={{
                        name: 'ChevronLeft',
                        size: 30,
                        color: colors.primary,
                    }}
                    backgroundColor={'transparent'}
                    onPress={() => changeMonth('prev')}
                />

                <TextComponent
                    text={format(currentMonth, 'MMMM, yyyy', { locale: locale })}
                    type='title1'
                    onPress={openPicker}
                />

                <ButtonComponent
                    mode="text"
                    iconProps={{
                        name: 'ChevronRight',
                        size: 30,
                        color: colors.primary,
                    }}
                    backgroundColor={'transparent'}
                    onPress={() => changeMonth('next')}
                />
            </RowComponent>

            <FlatList
                ref={flatListRef}
                data={daysInMonth}
                renderItem={renderItem}
                keyExtractor={(item) => item.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
            <DateTimePickerModal
                visible={modalVisible}
                mode={'date'}
                tempDate={tempDate}
                setTempDate={setTempDate}
                onCancel={onCancel}
                onConfirm={onConfirm}
            />
        </ColumnComponent>
    )
}