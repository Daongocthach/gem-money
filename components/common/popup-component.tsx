import {
  ActivityIndicator,
  Modal,
  Pressable,
  View
} from "react-native"

import { windowHeight } from "@/constants"
import { useTheme } from "@/hooks"
import { ThemeColorKeys } from '@/types'
import { ScrollView } from "react-native-gesture-handler"
import ButtonComponent from "./button-component"
import ColumnComponent from "./column-component"
import RowComponent from "./row-component"
import TextComponent from "./text-component"

type ModalProps = {
  disabled?: boolean
  modalTitle?: string
  modalDescription?: string
  isNotCloseModal?: boolean
  isYesCancelButton?: boolean
  isOnlyConfirmButton?: boolean
  visible: boolean
  children?: React.ReactNode
  buttonTitle?: string
  titleColor?: ThemeColorKeys
  descriptionColor?: ThemeColorKeys
  modalColor?: string
  buttonColor?: string
  isLoading?: boolean
  isScroll?: boolean
  isFullHeight?: boolean
  onClose: () => void
  handle?: () => void
}

const PopupComponent = ({
  disabled = false,
  modalTitle,
  modalDescription,
  isNotCloseModal,
  isYesCancelButton,
  isOnlyConfirmButton,
  visible,
  children,
  buttonTitle,
  titleColor,
  descriptionColor,
  buttonColor = '#7F64F4',
  modalColor,
  isLoading,
  isScroll,
  isFullHeight = false,
  onClose,
  handle,
}: ModalProps) => {
  const { colors } = useTheme()
  const handleConfirm = () => {
    if (handle) {
      handle()
    }
    if (!isNotCloseModal) {
      onClose()
    }
  }


  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
    >
      <Pressable onPress={onClose} style={{
        flex: 1,
        backgroundColor: '#11111188',
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        height: "100%",
      }}>
        <ColumnComponent style={{
          backgroundColor: modalColor || colors.modal,
          borderRadius: 16,
          width: '90%',
          maxWidth: 500,
          padding: 12,
          minHeight: isFullHeight ? windowHeight * 0.8 : undefined,
          maxHeight: windowHeight * 0.8,
          alignSelf: 'center',
          overflow: 'hidden',
          zIndex: 100,
        }} gap={10}>
          <ButtonComponent
            onPress={onClose}
            iconProps={{ name: 'X', size: 20 }}
            style={{ alignSelf: 'flex-end' }}
            ghost
          />

          {modalTitle && (
            <TextComponent
              text={modalTitle}
              textAlign="center"
              type="title"
              color={titleColor || "primary"}
              numberOfLines={2}
            />
          )}
          {modalDescription && (
            <TextComponent
              type="body"
              textAlign="center"
              text={modalDescription}
              color={descriptionColor}
              numberOfLines={20}
            />
          )}
          {isScroll
            ? <ScrollView>
              {children}
            </ScrollView>
            : <View>
              {children}
            </View>
          }

          {isLoading ? (
            <ActivityIndicator size="large" color={buttonColor} />
          ) : (
            <>
              {isOnlyConfirmButton && (
                <ButtonComponent
                  backgroundColor={buttonColor}
                  onPress={handleConfirm}
                  textProps={{ text: buttonTitle || "confirm" }}
                  disabled={disabled}
                />
              )}
              {isYesCancelButton && (
                <RowComponent gap={10} style={{ marginVertical: 15 }}>
                  <ButtonComponent
                    isIconOnly
                    textProps={{ 
                      text: "cancel", 
                      color: 'onCardDisabled',
                      type: 'title2'
                    }}
                    onPress={onClose}
                    backgroundColor='cardDisabled'
                    style={{ flex: 1 }}
                  />
                  <ButtonComponent
                    isIconOnly
                    backgroundColor={buttonColor}
                    onPress={handleConfirm}
                    textProps={{ 
                      text: buttonTitle || "confirm",
                      color: 'primary',
                      type: 'title2'
                    }}
                    disabled={disabled}
                    style={{ flex: 1 }}
                  />
                </RowComponent>
              )}
            </>
          )}
        </ColumnComponent>
      </Pressable>
    </Modal>
  )
}

export default PopupComponent
