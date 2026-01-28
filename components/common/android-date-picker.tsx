import { MONTHS, windowWidth } from "@/constants"
import { useTheme } from "@/hooks"
import useStore from "@/store"
import React, { useEffect, useState } from "react"
import { DatePicker } from "react-native-wheel-pick"

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
    const { currentLanguage } = useStore()
    const { colors } = useTheme()
    const [internalDate, setInternalDate] = useState(value)

    useEffect(() => {
        setInternalDate(value)
    }, [value])

    const handleChange = (d: Date) => {
        const merged = new Date(d)
        merged.setHours(value.getHours())
        merged.setMinutes(value.getMinutes())
        merged.setSeconds(value.getSeconds())

        setInternalDate(merged)
        onChange?.(merged)
    }

    return (
        <DatePicker
            style={{
                height: 200,
                marginHorizontal: 4,
                backgroundColor: colors.background,
                width: width
            }}
            date={internalDate}
            textSize={16}
            textColor={colors.icon}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onDateChange={handleChange}
            isShowSelectLine={false}
            selectTextColor={colors.onBackground}
            selectBackgroundColor='#8080801A'
            isCyclic={true}
            order="D-M-Y"
            labelUnit={{
                year: "",
                month: MONTHS[currentLanguage],
                date: "",
            }}
        />
    )
}