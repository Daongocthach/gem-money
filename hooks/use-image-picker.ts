import { showAlert } from "@/alerts"
import * as ImageManipulator from "expo-image-manipulator"
import * as ImagePicker from "expo-image-picker"

type FileProps = {
  uri: string
  name: string
  type: string
}

export const useImagePicker = () => {

  const openImagePicker = async (onPick: (file: FileProps) => void) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        showAlert("permission_denied_photos")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      })

      if (result.canceled || !result.assets?.length) return

      let asset = result.assets[0]

      const isHeic =
        asset.mimeType === "image/heic" ||
        asset.mimeType === "image/heif" ||
        asset.uri.toLowerCase().endsWith(".heic")

      if (isHeic) {
        const manipulated = await ImageManipulator.manipulateAsync(
          asset.uri,
          [],
          { format: ImageManipulator.SaveFormat.JPEG, compress: 0.9 }
        )

        asset = {
          ...asset,
          uri: manipulated.uri,
          fileName: (asset.fileName || "image") + ".jpg",
          mimeType: "image/jpeg",
        }
      }

      onPick({
        uri: asset.uri,
        name: asset.fileName ?? "image.jpg",
        type: asset.mimeType ?? "image/jpeg",
      })

    } catch (error) {
      showAlert("file_picker_error")
    }
  }

  return { openImagePicker }
}