import { addDays, addMonths, eachDayOfInterval, eachMonthOfInterval, format, startOfWeek, startOfYear } from 'date-fns'
import { useMemo } from "react"
import { useLocale } from "./use-locale"

export const useDateTimeLabels = () => {
  const { locale } = useLocale()

  const dayLabels = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 })
    const end = addDays(start, 6)

    return eachDayOfInterval({ start, end }).map((day) => ({
      full: format(day, 'EEEE', { locale }),
      short: format(day, 'EEE', { locale }),
      narrow: format(day, 'EEEEE', { locale }),
    }))
  }, [locale])

  const monthLabels = useMemo(() => {
    const start = startOfYear(new Date())
    const end = addMonths(start, 11)

    return eachMonthOfInterval({ start, end }).map((month) => ({
      full: format(month, 'MMMM', { locale }),
      short: format(month, 'MMM', { locale }),
    }))
  }, [locale])

  return {
    dayLabels,
    monthLabels
  }
}