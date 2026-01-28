import { addYears, eachDayOfInterval, endOfMonth, endOfYear, format, startOfMonth, startOfYear } from 'date-fns'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, TouchableOpacity, View } from 'react-native'

import { useTheme } from '@/hooks'
import useStore from '@/store'
import DateTimePickerModal from './date-time-picker-modal'
import IconComponent from './icon-component'
import RowComponent from './row-component'
import TextComponent from './text-component'

type DateSelectorProps = {
  dateSelected: Date
  setDateSelected: (date: Date) => void
}

export default function DateSelector({
  dateSelected,
  setDateSelected
}: DateSelectorProps) {
  const { darkMode } = useStore()
  const { colors } = useTheme()
  const { t } = useTranslation()

  const [monthDays, setMonthDays] = useState<Date[]>([])
  const [visible, setVisible] = useState(false)

  const minDate = startOfYear(addYears(dateSelected, -50))
  const maxDate = endOfYear(addYears(dateSelected, 50))

  const scrollRef = useRef<ScrollView>(null)
  const dayRefs = useRef<Record<string, View | null>>({})

  useEffect(() => {
    if (!dateSelected) return
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(dateSelected),
      end: endOfMonth(dateSelected),
    })
    setMonthDays(daysInMonth)

    setTimeout(() => {
      scrollToSelectedDay(dateSelected)
    }, 200)

  }, [dateSelected])

  const scrollToSelectedDay = (selectedDate: Date) => {
    const formattedDay = format(selectedDate, 'dd/MM/yyyy')
    const selectedRef = dayRefs.current[formattedDay]

    if (selectedRef && scrollRef.current) {
      selectedRef.measureLayout(
        scrollRef.current as any,
        (x) => {
          scrollRef.current?.scrollTo({ x: Math.max(x - 18, 0), animated: true })
        },
        () => {
          console.log('Không thể đo vị trí của ngày đã chọn.')
        }
      )
    }
  }

  const onChangeDate = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDateSelected(selectedDate)
    }
    setVisible(false)
  }

  return (
    <RowComponent>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {monthDays.map((day, index) => {
          const formattedDay = format(day, 'dd/MM/yyyy')
          const isCurrentDay = formattedDay === format(dateSelected ? dateSelected : new Date(), 'dd/MM/yyyy')
          const isToday = formattedDay === format(new Date(), 'dd/MM/yyyy')

          const backgroundColor: readonly [string, string] = isCurrentDay ?
            [colors.primary, colors.primary] :
            [colors.cardVariant, colors.cardVariant]

          return (
            <TouchableOpacity key={formattedDay} onPress={() => setDateSelected(day)}>
              <LinearGradient
                colors={backgroundColor}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  marginRight: 7,
                  padding: 12,
                  borderRadius: 12
                }}
              >
                <View ref={(element) => { dayRefs.current[formattedDay] = element }}>
                  <TextComponent
                    type='caption'
                    fontWeight='semibold'
                    color={
                      (darkMode || isCurrentDay) ?
                        'onPrimary' :
                        'onCardDisabled'
                    }
                  >
                    {isToday ? t('today') + " (" + format(day, 'dd') + ") " : format(day, 'dd')}
                  </TextComponent>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      <TouchableOpacity onPress={() => setVisible(true)}>
        <LinearGradient
          colors={[colors.primary, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            marginLeft: 10,
            padding: 12,
            borderRadius: 12
          }}
        >
          <RowComponent gap={4}>
            <IconComponent
              name='Calendar'
              size={15}
              color='onPrimary'
            />
            <TextComponent
              type='caption'
              fontWeight='semibold'
              color='onPrimary'
            >
              {format(dateSelected ? dateSelected : new Date(), 'yyyy-MM-dd')}
            </TextComponent>

          </RowComponent>
        </LinearGradient>
      </TouchableOpacity>
      <DateTimePickerModal
        visible={visible}
        mode={'date'}
        minDate={minDate}
        maxDate={maxDate}
        tempDate={dateSelected}
        setTempDate={(date: Date) => setDateSelected(date)}
        onCancel={() => setVisible(false)}
        onConfirm={() => onChangeDate(null, dateSelected)}
      />
    </RowComponent>

  )
}