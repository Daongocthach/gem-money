import { windowWidth } from "@/constants";
import { useTheme } from "@/hooks";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import WheelPickerExpo from 'react-native-wheel-picker-expo';

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

export default function AndroidTimePicker({
  value,
  onChange,
  width = windowWidth,
  minuteStep = 1,
  showSeconds = true,
  minTime,
  maxTime,
}: TimePickerProps) {
  const { colors } = useTheme()

  const snapMinute = (minute: number) => Math.round(minute / minuteStep) * minuteStep

  const [hour, setHour] = useState(value.getHours())
  const [minute, setMinute] = useState(snapMinute(value.getMinutes()))
  const [second, setSecond] = useState(value.getSeconds())

  const hoursData = useMemo(() => {
    const minHour = minTime?.getHours() ?? 0
    const maxHour = maxTime?.getHours() ?? 23
    return Array.from({ length: 24 }, (_, i) => i)
      .filter(h => h >= minHour && h <= maxHour)
      .map(h => ({ label: h < 10 ? `0${h}` : `${h}`, value: h }))
  }, [minTime, maxTime])

  const minutesData = useMemo(() => {
    return Array.from({ length: 60 / minuteStep }, (_, i) => {
      const m = i * minuteStep
      return { label: m < 10 ? `0${m}` : `${m}`, value: m }
    })
  }, [minuteStep])

  const secondsData = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({ label: i < 10 ? `0${i}` : `${i}`, value: i }))
  }, [])

  const emit = (h: number, m: number, s: number) => {
    onChange?.({ hour: h, minute: m, second: s })
  }

  return (
    <View style={[styles.row, { width, backgroundColor: colors.background }]}>
      <WheelPickerExpo
        height={200}
        width={width / (showSeconds ? 3.5 : 2.5)}
        initialSelectedIndex={hoursData.findIndex(h => h.value === hour)}
        items={hoursData}
        backgroundColor={colors.background}
        selectedStyle={{ borderColor: colors.primary }}
        onChange={({ item }) => {
          setHour(item.value)
          emit(item.value, minute, second)
        }}
      />

      <WheelPickerExpo
        height={200}
        width={width / (showSeconds ? 3.5 : 2.5)}
        initialSelectedIndex={minutesData.findIndex(m => m.value === minute)}
        items={minutesData}
        backgroundColor={colors.background}
        selectedStyle={{ borderColor: colors.primary }}
        onChange={({ item }) => {
          setMinute(item.value)
          emit(hour, item.value, second)
        }}
      />

      {showSeconds && (
        <WheelPickerExpo
          height={200}
          width={width / 3.5}
          initialSelectedIndex={secondsData.findIndex(s => s.value === second)}
          items={secondsData}
          backgroundColor={colors.background}
          selectedStyle={{ borderColor: colors.primary }}
          onChange={({ item }) => {
            setSecond(item.value)
            emit(hour, minute, item.value)
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center'
  }
})