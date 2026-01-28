import { showAlert } from "@/alerts"
import * as DocumentPicker from "expo-document-picker"

export type FileProps = {
    uri: string
    name: string
    type: string
}

export const useFilePicker = () => {

    const openFilePicker = async (onPick: (file: FileProps) => void) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
            })

            if (result.canceled) {
                return
            }

            const asset = result.assets[0]

            const fileName = asset.name || 'file_upload'
            const mimeType = asset.mimeType || 'application/octet-stream'

            onPick({
                uri: asset.uri,
                name: fileName,
                type: mimeType,
            })

        } catch (error) {
            showAlert("file_picker_error")
        }
    }

    return { openFilePicker }
}