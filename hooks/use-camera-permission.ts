import { showAlert } from "@/alerts"
import { useTranslation } from "react-i18next"
import { PermissionsAndroid, Platform } from "react-native"

export function useCameraPermission() {
    const { t } = useTranslation()


    const checkAndRequestPermission = async (): Promise<boolean> => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: t('camera permission'),
                    message: t('the app needs camera access to take photos'),
                    buttonPositive: t('OK'),
                    buttonNegative: t('cancel'),
                }
            )

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true
            } else {
                showAlert('camera_permission_denied')
                return false
            }
        } 
        
        return true 
    }

    return { checkAndRequestPermission }
}