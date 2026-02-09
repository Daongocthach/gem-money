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

    const getDaysInMonth = (
        year: number,
        month: number
    ) => new Date(year, month + 1, 0).getDate()

    const [selectedYear, setSelectedYear] = useState(value.getFullYear())
    const [selectedMonth, setSelectedMonth] = useState(value.getMonth())
    const [selectedDay, setSelectedDay] = useState(value.getDate())


    const yearsData = useMemo(() => {
        const startYear = minimumDate ? minimumDate.getFullYear() : 2000
        const endYear = maximumDate ? maximumDate.getFullYear() : 2050
        return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
            const y = startYear + index
            return { label: y.toString(), value: y }
        })
    }, [minimumDate, maximumDate])

    const monthsData = useMemo(() => {
        const currentYear = value.getFullYear()
        let startMonth = 0
        let endMonth = 11

        if (minimumDate && currentYear === minimumDate.getFullYear()) {
            startMonth = minimumDate.getMonth()
        }
        if (maximumDate && currentYear === maximumDate.getFullYear()) {
            endMonth = maximumDate.getMonth()
        }

        return monthLabels
            .map((item, index) => ({ label: item.full, value: index }))
            .filter(m => m.value >= startMonth && m.value <= endMonth)
    }, [value.getFullYear(), minimumDate, maximumDate, monthLabels])


    const daysData = useMemo(() => {
        const currentYear = value.getFullYear()
        const currentMonth = value.getMonth()
        const maxDaysInMonth = getDaysInMonth(currentYear, currentMonth)

        let startDay = 1
        let endDay = maxDaysInMonth

        if (minimumDate && currentYear === minimumDate.getFullYear() && currentMonth === minimumDate.getMonth()) {
            startDay = minimumDate.getDate()
        }
        if (maximumDate && currentYear === maximumDate.getFullYear() && currentMonth === maximumDate.getMonth()) {
            endDay = maximumDate.getDate()
        }

        const days = []
        for (let i = startDay; i <= endDay; i++) {
            days.push({ label: i.toString(), value: i })
        }
        return days
    }, [value.getFullYear(), value.getMonth(), minimumDate, maximumDate])

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