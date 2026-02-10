import { FONT_FAMILIES } from '@/constants'
import { useTheme } from '@/hooks'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Calendar, DateData } from 'react-native-calendars'
import ButtonComponent from './button-component'
import ColumnComponent from './column-component'
import ModalComponent from './modal-component'
import RowComponent from './row-component'

interface DateRangePickerProps {
  visible: boolean
  onClose: () => void
  onSelectRange: (range: { startDate: string; endDate: string }) => void
}

export default function DateRangePicker({
  visible,
  onClose,
  onSelectRange
}: DateRangePickerProps) {
  const { colors } = useTheme()
  const [range, setRange] = useState<{ [key: string]: any }>({})
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)

  const onDayPress = (day: DateData) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString)
      setEndDate(null)
      setRange({
        [day.dateString]: { startingDay: true, color: colors.primary, textColor: 'white' },
      })
    } else {
      const start = new Date(startDate)
      const end = new Date(day.dateString)

      if (end < start) {
        setStartDate(day.dateString)
        setRange({
          [day.dateString]: { startingDay: true, color: colors.primary, textColor: 'white' },
        })
      } else {
        let newRange: { [key: string]: any } = {}
        let tempDate = new Date(start)

        while (tempDate <= end) {
          const dateStr = tempDate.toISOString().split('T')[0]
          newRange[dateStr] = {
            color: colors.primary + '33',
            textColor: colors.primary,
          }
          tempDate.setDate(tempDate.getDate() + 1)
        }

        newRange[startDate] = { startingDay: true, color: colors.primary, textColor: 'white' }
        newRange[day.dateString] = { endingDay: true, color: colors.primary, textColor: 'white' }

        setEndDate(day.dateString)
        setRange(newRange)
      }
    }
  }

  const handleConfirm = () => {
    if (startDate && endDate) {
      onSelectRange({ startDate, endDate })
      onClose()
    }
  }

  return (
    <ModalComponent visible={visible} onClose={onClose}>
      <View style={styles.centeredView}>
        <ColumnComponent style={styles.modalView} gap={20}>
          <Calendar
            markingType={'period'}
            markedDates={range}
            onDayPress={onDayPress}
            theme={{
              todayTextColor: colors.primary,
              arrowColor: colors.primary,

              textMonthFontFamily: FONT_FAMILIES.SEMIBOLD,

              textDayFontFamily: FONT_FAMILIES.REGULAR,
              textDayFontSize: 12,
  
            }}
          />

          <RowComponent justify='flex-end' gap={30}>
            <ButtonComponent
              mode='text'
              onPress={onClose}
              textProps={{
                text: 'cancel',
                color: 'icon'
              }}
            />
            <ButtonComponent
              mode='text'
              onPress={handleConfirm}
              disabled={!endDate}
              textProps={{
                text: 'confirm',
                color: endDate ? 'primary' : 'onCardDisabled',
                type: 'title2',
              }}
            />
          </RowComponent>
        </ColumnComponent>
      </View>
    </ModalComponent>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    elevation: 5,
  },
})