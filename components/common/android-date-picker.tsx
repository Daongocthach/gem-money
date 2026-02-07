import { windowWidth } from "@/constants"
import { useDateTimeLabels, useTheme } from "@/hooks"
import React, { useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"
import WheelPickerExpo from 'react-native-wheel-picker-expo'

interface Props {
    value: Date
    minimumDate?: Date
    maximumDate?: Date
    onChange?: (date: Date) => void
    width?: number
}

export default function AndroidDatePicker({
    value,
    minimumDate,
    maximumDate,
    width = windowWidth,
    onChange,
}: Props) {
    const { colors } = useTheme()
    const { monthLabels } = useDateTimeLabels()

    const yearsData = useMemo(() => {
        const startYear = minimumDate ? minimumDate.getFullYear() : 2000
        const endYear = maximumDate ? maximumDate.getFullYear() : 2050
        return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
            const y = startYear + index
            return { label: y.toString(), value: y }
        })
    }, [minimumDate, maximumDate])

    const monthsData = useMemo(() => {
        return monthLabels.map((item, index) => ({
            label: item.full,
            value: index
        }))
    }, [monthLabels])

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()

    const [selectedYear, setSelectedYear] = useState(value.getFullYear())
    const [selectedMonth, setSelectedMonth] = useState(value.getMonth())
    const [selectedDay, setSelectedDay] = useState(value.getDate())

    const daysData = useMemo(() => {
        const numDays = getDaysInMonth(selectedYear, selectedMonth)
        return Array.from({ length: numDays }, (_, index) => ({
            label: (index + 1).toString(),
            value: index + 1
        }))
    }, [selectedYear, selectedMonth])

    const handleDateChange = (year: number, month: number, day: number) => {
        const newDate = new Date(value)
        newDate.setFullYear(year)
        newDate.setMonth(month)
        const maxDays = getDaysInMonth(year, month)
        const safeDay = day > maxDays ? maxDays : day
        newDate.setDate(safeDay)

        onChange?.(newDate)
    }

    return (
        <View style={[styles.container, { width, backgroundColor: colors.background }]}>
            <WheelPickerExpo
                height={200}
                width={width * 0.2}
                initialSelectedIndex={selectedDay - 1}
                items={daysData}
                backgroundColor={colors.background}
                onChange={({ item }) => {
                    setSelectedDay(item.value)
                    handleDateChange(selectedYear, selectedMonth, item.value)
                }}
                selectedStyle={{
                    borderWidth: 1,
                    borderColor: colors.outline
                }}
            />

            <WheelPickerExpo
                height={200}
                width={width * 0.5}
                initialSelectedIndex={selectedMonth}
                items={monthsData}
                backgroundColor={colors.background}
                onChange={({ item }) => {
                    setSelectedMonth(item.value)
                    handleDateChange(selectedYear, item.value, selectedDay)
                }}
                selectedStyle={{
                    borderWidth: 1,
                    borderColor: colors.outline
                }}
            />

            <WheelPickerExpo
                height={200}
                width={width * 0.25}
                initialSelectedIndex={yearsData.findIndex(year => year.value === selectedYear)}
                items={yearsData}
                backgroundColor={colors.background}
                onChange={({ item }) => {
                    setSelectedYear(item.value)
                    handleDateChange(item.value, selectedMonth, selectedDay)
                }}
                selectedStyle={{
                    borderWidth: 1,
                    borderColor: colors.outline
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 220,
        alignItems: 'center',
        justifyContent: 'center',
    }
})