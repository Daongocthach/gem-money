import { createContext, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Alert, Platform, View } from "react-native"

import { AlertType, setGlobalShowAlert } from "@/alerts/alert"
import PopupComponent from "@/components/common/popup-component"
import { useTheme } from "@/hooks"

const AlertContext = createContext<(config: AlertType) => void>(() => { })

export const useGlobalAlert = () => useContext(AlertContext)

export function GlobalAlertProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const [visible, setVisible] = useState(false)
  const [config, setConfig] = useState<AlertType | null>(null)
  const [loading, setLoading] = useState(false)

  const show = (newConfig: AlertType) => {
    setConfig(newConfig)
    if (Platform.OS === 'android') {
      setVisible(true)
    } else {
      Alert.alert(t(newConfig.text1), t(newConfig.text2),
        newConfig.type === 'ok' ? [{ text: "OK", style: "cancel" }] :
          newConfig.type === 'confirm' ?
            [
              { text: t("cancel"), style: "cancel" },
              {
                text: t("confirm"),
                onPress: () => {
                  if (newConfig.onConfirm)
                    newConfig.onConfirm()
                },
              },
            ] : []
      )
    }
  }

  useEffect(() => {
    setGlobalShowAlert(show)
  }, [])

  const hide = () => {
    setLoading(false)
    setVisible(false)
  }

  const handleConfirm = async () => {
    if (config?.onConfirm) {
      try {
        setLoading(true)
        await config.onConfirm()
      } catch (error) {
        console.error("Alert confirmation failed:", error)
      } finally {
        setLoading(false)
        hide()
      }
    } else {
      hide()
    }
  }

  const isConfirm = config?.type === 'confirm'

  return (
    <AlertContext.Provider value={show}>
      {children}
      <View>
        <PopupComponent
          visible={visible}
          onClose={hide}
          isLoading={loading}
          modalTitle={config?.text1 || 'alert'}
          modalDescription={config?.text2}
          isYesCancelButton={isConfirm}
          handle={handleConfirm}
          isOnlyConfirmButton={!isConfirm}
          buttonColor={config?.type === 'error' ? colors.error : config?.buttonColor || colors.primary}
        />
      </View>
    </AlertContext.Provider>
  )
}