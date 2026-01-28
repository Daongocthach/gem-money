import { windowWidth } from "@/constants"
import { useTheme } from "@/hooks"
import useStore from "@/store"
import DateTimePicker from "@react-native-community/datetimepicker"
import {
    Modal,
    Platform,
    Pressable,
} from "react-native"
import AndroidDatePicker from "./android-date-picker"
import AndroidTimePicker from "./android-time-picker"
import ButtonComponent from "./button-component"
import ColumnComponent from "./column-component"
import RowComponent from "./row-component"

interface DateTimePickerModalProps {
    visible: boolean
    mode: "date" | "time" | "datetime"
    tempDate: Date
    minDate?: Date
    maxDate?: Date
    minuteStep?: 1 | 5 | 10 | 15 | 30
    showSeconds?: boolean
    minTime?: Date
    onCancel: () => void
    onConfirm: () => void
    setTempDate: (date: Date) => void
}

export default function DateTimePickerModal({
    visible,
    mode,
    tempDate,
    minDate,
    maxDate,
    minuteStep,
    showSeconds,
    minTime,
    onCancel,
    onConfirm,
    setTempDate,
}: DateTimePickerModalProps) {
    const { colors } = useTheme()
    const { currentLanguage } = useStore()

    return (
        <Modal visible={visible} transparent animationType="slide">
            <Pressable
                style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)" }}
                onPress={onCancel}
            />

            <ColumnComponent backgroundColor="background" style={{ paddingBottom: Platform.OS === "ios" ? 10 : 50 }}>
                <RowComponent
                    justify="space-between"
                    style={{ paddingHorizontal: 12, paddingTop: 12, width: "100%" }}
                >
                    <ButtonComponent
                        textProps={{ text: 'cancel', type: 'title2' }}
                        ghost
                        onPress={onCancel}
                    />
                    <ButtonComponent
                        textProps={{ text: 'confirm', color: 'primary', type: 'title2' }}
                        ghost
                        onPress={onConfirm}
                    />
                </RowComponent>

                {Platform.OS === "ios" ? (
                    <DateTimePicker
                        mode={mode === "datetime" ? "datetime" : mode}
                        display="spinner"
                        value={tempDate}
                        minimumDate={minDate}
                        maximumDate={maxDate}
                        locale={currentLanguage}
                        onChange={(_, selected) => {
                            if (selected) setTempDate(selected)
                        }}
                        textColor={colors.onBackground}
                    />
                ) : (
                    <ColumnComponent
                        style={{
                            width: "100%",
                            paddingTop: 20,
                        }}
                    >
                        {mode === "date" && (
                            <AndroidDatePicker
                                value={tempDate}
                                minimumDate={minDate}
                                maximumDate={maxDate}
                                onChange={(date: Date) => setTempDate(date)}
                            />
                        )}

                        {mode === "time" && (
                            <AndroidTimePicker
                                value={tempDate}
                                onChange={({ hour, minute, second }) => {
                                    const date = new Date(tempDate)
                                    date.setHours(hour)
                                    date.setMinutes(minute)
                                    date.setSeconds(second)
                                    setTempDate(date)
                                }}
                                minuteStep={minuteStep}
                                showSeconds={showSeconds}
                                minTime={minTime}
                            />
                        )}

                        {mode === "datetime" && (
                            <RowComponent gap={10} >
                                <AndroidDatePicker
                                    width={windowWidth * 0.5}
                                    value={tempDate}
                                    minimumDate={minDate}
                                    maximumDate={maxDate}
                                    onChange={(date: Date) => {
                                        const merged = new Date(date)
                                        merged.setHours(tempDate.getHours())
                                        merged.setMinutes(tempDate.getMinutes())
                                        merged.setSeconds(tempDate.getSeconds())
                                        setTempDate(merged)
                                    }}
                                />

                                <AndroidTimePicker
                                    width={windowWidth * 0.5}
                                    value={tempDate}
                                    onChange={({ hour, minute, second }: { hour: number, minute: number, second?: number }) => {
                                        const date = new Date(tempDate)
                                        date.setHours(hour)
                                        date.setMinutes(minute)
                                        date.setSeconds(second ?? 0)
                                        setTempDate(date)
                                    }}
                                />
                            </RowComponent>
                        )}
                    </ColumnComponent>
                )}
            </ColumnComponent>
        </Modal>
    )
}