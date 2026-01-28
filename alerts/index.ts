import i18next from "@/locales"
import Toast from "react-native-toast-message"
import { showCustomAlert } from "./alert"
import { alertList, AlertType } from "./alert-list"
import { toastList, ToastType } from "./toast-list"

export const showToast = (name: ToastType) => {

    if (!toastList[name]) return
    const { type, text1, text2 } = toastList[name]

    Toast.show({
        type,
        text1: text1 ? i18next.t(text1) : "",
        text2: text2 ? i18next.t(text2) : "",
        autoHide: true,
        visibilityTime: 2000,
    })
}

export const showToastWithCustomText = (
    text1: string,
    text2: string,
    type: 'error' | 'success' | 'info',
) => {
    Toast.show({
        type,
        text1: text1 ? i18next.t(text1) : "",
        text2: text2 ? i18next.t(text2) : "",
        autoHide: true,
        visibilityTime: 2000,
    })
}


export const showAlert = (name: AlertType, handle?: () => void, handleReject?: () => void) => {
    if (!alertList[name]) return
    const { type, text1, text2 } = alertList[name]
    showCustomAlert({
        text1: i18next.t(text1),
        text2: i18next.t(text2),
        type: type,
        onConfirm: handle,
        onReject: handleReject,
    })
}

export const showAlertWithCustomText = (
    text1: string,
    text2: string,
    type: "ok" | "confirm" | "error" | "warning",
    handle?: () => void,
    handleReject?: () => void
) => {
    showCustomAlert({
        text1: i18next.t(text1),
        text2: i18next.t(text2),
        type: type,
        onConfirm: handle,
        onReject: handleReject,
    })
}
