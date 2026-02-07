import i18next from "i18next"
import { initReactI18next } from "react-i18next"

import { getCurrentLanguage } from "@/utils"
import DATA_EN from "./en/data.json"
import DATA_VI from "./vi/data.json"
import DATA_ZH_CN from "./zh-CN/data.json"
import DATA_ZH_TW from "./zh-TW/data.json"

export const defaultNS = "data"

export const resources = {
  "zh-TW": {
    data: DATA_ZH_TW,
  },
  "zh-CN": {
    data: DATA_ZH_CN,
  },
  "en": {
    data: DATA_EN,
  },
  "vi": {
    data: DATA_VI,
  },
}

getCurrentLanguage().then((language) => {
  const lng = language || "vi"

  i18next.use(initReactI18next).init({
    lng,
    resources,
    defaultNS,
    ns: ["data"],
    fallbackLng: "vi",
    supportedLngs: ["zh-TW", "zh-CN", "en", "vi"],
    interpolation: { escapeValue: false },
  })
})

export default i18next