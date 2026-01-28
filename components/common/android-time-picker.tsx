import { windowWidth } from "@/constants"
import { useTheme } from "@/hooks"
import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Picker } from "react-native-wheel-pick"

interface TimePickerProps {
  value: Date
  onChange?: (value: { hour: number; minute: number; second: number }) => void
  textSize?: number
  width?: number
  minuteStep?: 1 | 5 | 10 | 15 | 30
  showSeconds?: boolean
  minTime?: Date
  maxTime?: Date
}

const buildMinutes = (step: number) =>
  Array.from({ length: 60 / step }, (_, index) => String(index * step))

export default function AndroidTimePicker({
  value,
  onChange,
  textSize = 16,
  width = windowWidth,
  minuteStep = 1,
  showSeconds = true,
  minTime,
  maxTime,
}: TimePickerProps) {
  const { colors } = useTheme()

  const snapMinute = (minute: number) =>
    Math.round(minute / minuteStep) * minuteStep

  const minHour = minTime?.getHours()
  const maxHour = maxTime?.getHours()
  const minMinute = minTime?.getMinutes() ?? 0
  const maxMinute = maxTime?.getMinutes() ?? 59

  const hours = Array.from({ length: 24 }, (_, index) => index)
    .filter(hour => (minHour == null || hour >= minHour) && (maxHour == null || hour <= maxHour))
    .map(String)

  const minutes = buildMinutes(minuteStep)

  const seconds = Array.from({ length: 60 }, (_, i) => String(i))

  const [hour, setHour] = useState(value.getHours())
  const [minute, setMinute] = useState(
    snapMinute(value.getMinutes())
  )
  const [second, setSecond] = useState(value.getSeconds())

  useEffect(() => {
    if (!minTime) return

    const selected = new Date(value)
    if (selected < minTime) {
      const h = minTime.getHours()
      const m = snapMinute(minTime.getMinutes())

      setHour(h)
      setMinute(m)
      setSecond(0)
      emit(h, m, 0)
    }
  }, [minTime])

  const emit = (h: number, m: number, s: number) => {
    onChange?.({ hour: h, minute: m, second: s })
  }

  return (
    <View style={[styles.row, { width }]}>

      <Picker
        style={[styles.picker, { backgroundColor: colors.background }]}
        pickerData={hours}
        selectedValue={String(hour)}
        textSize={textSize}
        textColor={colors.icon}
        selectTextColor={colors.onBackground}
        selectBackgroundColor="#8080801A"
        isShowSelectLine={false}
        isCyclic={false}
        onValueChange={(v: string) => {
          const h = Number(v)
          setHour(h)

          if (minTime && h === minHour && minute < minMinute) {
            const m = snapMinute(minMinute)
            setMinute(m)
            emit(h, m, second)
            return
          }

          emit(h, minute, second)
        }}
      />

      <Picker
        style={[styles.picker, { backgroundColor: colors.background }]}
        pickerData={minutes}
        selectedValue={String(minute)}
        textSize={textSize}
        textColor={colors.icon}
        selectTextColor={colors.onBackground}
        selectBackgroundColor="#8080801A"
        isShowSelectLine={false}
        isCyclic={false}
        onValueChange={(v: string) => {
          const m = Number(v)
          setMinute(m)
          emit(hour, m, second)
        }}
      />

      {showSeconds && (
        <Picker
          style={[styles.picker, { backgroundColor: colors.background }]}
          pickerData={seconds}
          selectedValue={String(second)}
          textSize={textSize}
          textColor={colors.icon}
          selectTextColor={colors.onBackground}
          selectBackgroundColor="#8080801A"
          isShowSelectLine={false}
          isCyclic
          onValueChange={(v: string) => {
            const s = Number(v)
            setSecond(s)
            emit(hour, minute, s)
          }}
        />
      )}
    </View>
  )
}



const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    flexGrow: 1,
    height: 200,
  },
})
