import { format } from 'date-fns'
import { useMemo } from 'react'
import { ViewStyle } from 'react-native'

import InlineDropdown from './inline-dropdown'

type ShiftType = 'regular' | 'night'

interface TimeSlotSelectorProps {
    value: Date
    onChange?: (value: Date) => void
    label?: string
    viewStyle?: ViewStyle
    type?: ShiftType
    minTime?: string
    maxTime?: string
    stepMinutes?: number
}

const timeToMinutes = (time: string) => {
    const [hour, minute] = time.split(':').map(Number)
    return hour * 60 + minute
}

const minutesToTime = (minutes: number) => {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export default function TimeSlotSelector({
    value,
    onChange,
    label,
    viewStyle,
    type = 'night',
    minTime,
    maxTime,
    stepMinutes = 30,
}: TimeSlotSelectorProps) {
    const slots = useMemo(() => {
        let min = '00:00'
        let max = '24:00'

        if (type === 'regular') {
            min = '17:30'
            max = '24:00'
        }

        if (type === 'night') {
            min = '00:00'
            max = '24:00'
        }

        if (minTime) min = minTime
        if (maxTime) max = maxTime

        const minMinutes = timeToMinutes(min)
        const maxMinutes = timeToMinutes(max)

        const result: { label: string; value: string }[] = []

        for (let minute = minMinutes; minute <= maxMinutes; minute += stepMinutes) {
            if (minute > 24 * 60) break

            const time = minutesToTime(minute)
            result.push({ label: time, value: time })
        }

        return result
    }, [type, minTime, maxTime, stepMinutes])

    const handleSelect = (timeStr: string) => {
        const [hour, minute] = timeStr.split(':').map(Number)
        const next = new Date(value)

        if (hour === 24) {
            next.setHours(23, 59, 59)
        } else {
            next.setHours(hour, minute, 0)
        }

        onChange?.(next)
    }

    return (
        <InlineDropdown
            label={label}
            placeholder='select time'
            selected={format(value, 'HH:mm')}
            setSelected={(value) => handleSelect(String(value))}
            selects={slots}
            hideFooter
            viewStyle={{ flexGrow: 1, ...viewStyle }}
            autoScroll
        />
    )
}
