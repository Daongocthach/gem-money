import useStore from "@/store"
import { format, formatDistanceToNow, isValid } from 'date-fns'
import { enUS, vi, zhCN, zhTW } from "date-fns/locale"
import { useMemo } from "react"

type DateTimeMode = "date" | "time" | "datetime" | "relative" 

const LOCALE_MAP = {
  vi: vi,
  zhTW: zhTW,
  zhCN: zhCN,
  enUS: enUS
}

export const useLocale = () => {
  const { currentLanguage } = useStore()

  const locale = useMemo(() => {
    return LOCALE_MAP[currentLanguage as keyof typeof LOCALE_MAP] || enUS
  }, [currentLanguage])

  const formatLocalDateTime = (
    datetime: string | Date | number,
    mode: DateTimeMode = "datetime", 
    customFormat?: string
  ) => {
    if (!datetime) return ''
    
    const dateObject = new Date(datetime)
    
    if (!isValid(dateObject)) {
      return ''
    }

    if (mode === "relative") {
      return formatDistanceToNow(dateObject, { 
        addSuffix: true, 
        locale
      })
    }

    let formatString = customFormat
    
    if (!formatString) {
      switch (mode) {
        case "date":
          formatString = "dd/MM/yyyy"
          break
        case "time":
          formatString = "HH:mm" 
          break
        case "datetime":
        default:
          formatString = "HH:mm, dd/MM/yyyy"
          break
      }
    }
    
    return format(dateObject, formatString, { locale })
  }

  const formatDistance = (datetime: string | Date | number) => {
      return formatLocalDateTime(datetime, "relative")
  }

  return { 
      formatLocalDateTime,
      formatDistance,
      locale
  }
}