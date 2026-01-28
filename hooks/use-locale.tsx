import { format, formatDistanceToNow } from 'date-fns'
import { enUS, vi, zhCN, zhTW } from "date-fns/locale"

import { useMemo } from "react"

import useStore from "@/store"

type DateTimeMode = "date" | "time" | "datetime" | "relative" 

export const useLocale = () => {
  const { currentLanguage } = useStore()

  const locale = useMemo(() => {
    switch (currentLanguage) {
      case "zh-TW":
        return zhTW

      case "zh-CN":
        return zhCN

      case "vi":
        return vi

      default:
        return enUS
    }
  }, [currentLanguage])

  const formatLocalDateTime = (
    datetime: string, 
    mode: DateTimeMode = "datetime", 
    customFormat?: string
  ) => {
    const dateObject = new Date(datetime)

    if (mode === "relative") {
      return formatDistanceToNow(dateObject, { 
        addSuffix: true, 
        locale
      })
    }

    let formatString: string
    
    if (customFormat) {
      formatString = customFormat 
    } else {
      switch (mode) {
        case "date":
          formatString = "dd MMM yyyy" 
          break
        case "time":
          formatString = "HH:mm:ss" 
          break
        case "datetime":
        default:
          formatString = "dd MMM yyyy, HH:mm:ss"
          break
      }
    }
    
    return format(dateObject, formatString, { locale })
  }

  const formatDistance = (datetime: string) => {
      return formatLocalDateTime(datetime, "relative")
  }

  return { 
      formatLocalDateTime,
      formatDistance
  }
}