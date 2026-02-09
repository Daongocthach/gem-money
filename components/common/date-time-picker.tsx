
import {
    addYears,
    endOfYear,
    format,
    startOfYear
} from "date-fns"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
    Pressable,
    ViewProps
} from "react-native"

import { useLocale, useTheme } from "@/hooks"
import ButtonComponent from "./button-component"
import ColumnComponent from "./column-component"
import DateTimePickerModal from "./date-time-picker-modal"
import Icon from "./icon-component"
import TextComponent from "./text-component"

interface DateTimePickerComponentProps {
  mode: "date" | "time" | "datetime"
  label?: string
  dateTime: Date | undefined
  setDateTime: (date: Date | undefined) => void
  disabled?: boolean
  placeholder?: string
  viewStyle?: ViewProps['style']
  hideClear?: boolean
  errorMessage?: string
  minuteStep?: 1 | 5 | 10 | 15 | 30
  showSeconds?: boolean
  minTime?: Date
}

export default function DateTimePicker({
  label,
  mode = "date",
  dateTime,
  setDateTime,
  disabled = false,
  placeholder = "select date",
  hideClear = false,
  viewStyle,
  errorMessage,
  minuteStep,
  showSeconds = true,
  minTime,
}: DateTimePickerComponentProps) {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { formatLocalDateTime } = useLocale()

  const [modalVisible, setModalVisible] = useState(false)
  const [tempDate, setTempDate] = useState<Date>(dateTime ?? new Date())

  const now = new Date()
  const minDate = startOfYear(addYears(now, -50))
  const maxDate = endOfYear(addYears(now, 50))


  const formatDateDisplay = useMemo(() => {
    if (mode === "date") return (date: Date) => formatLocalDateTime(date.toISOString(), "date")
    if (mode === "time") return (date: Date) => format(date, showSeconds ? "HH:mm:ss" : "HH:mm")
    return (date: Date) => formatLocalDateTime(date.toISOString(), "datetime")
  }, [mode, formatLocalDateTime, showSeconds])

  const openPicker = () => {
    setTempDate(dateTime ?? new Date())
    setModalVisible(true)
  }

  const onCancel = () => {
    setModalVisible(false)
  }

  const onConfirm = () => {
    setModalVisible(false)
    setDateTime(new Date(tempDate))
  }

  return (
    <ColumnComponent gap={4} style={[{ flexGrow: 1, flexShrink: 1 }, viewStyle]}>
      {label && (
        <TextComponent
          text={label}
          type="caption"
        />
      )}

      <Pressable
        style={{
          height: 44,
          padding: 10,
          borderWidth: 1,
          borderRadius: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          borderColor: colors.outlineVariant,
          backgroundColor: "transparent"
        }}
        onPress={openPicker}
        disabled={disabled}
      >
        <Icon name="Calendar" size={18} />
        <TextComponent
          numberOfLines={1}
          style={{
            flex: 1,
            color: dateTime ? colors.onBackground : colors.icon
          }}
        >
          {dateTime ? formatDateDisplay(dateTime) : t(placeholder)}
        </TextComponent>
        {!hideClear && dateTime &&
          <ButtonComponent
            mode="text"
            iconProps={{ name: "X", size: 16, color: colors.icon }}
          />
        }
      </Pressable>

      <DateTimePickerModal
        visible={modalVisible}
        mode={mode}
        tempDate={tempDate}
        minDate={minDate}
        maxDate={maxDate}
        onCancel={onCancel}
        onConfirm={onConfirm}
        setTempDate={setTempDate}
        minuteStep={minuteStep}
        showSeconds={showSeconds}
        minTime={minTime}
      />

      {errorMessage && (
        <TextComponent
          type='caption'
          text={errorMessage}
          color='error'
        />
      )}
    </ColumnComponent>
  )
}