import {
    Modal,
    ModalProps,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SpaceComponent from './space-component'

interface CustomModalProps extends ModalProps {
    onClose?: () => void
    withBackdrop?: boolean
}

export default function ModalComponent({ visible, children, onClose, withBackdrop = true, ...rest }: CustomModalProps) {
    const insets = useSafeAreaInsets()
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent
            presentationStyle="overFullScreen"
            {...rest}
        >
            <SpaceComponent height={insets.top} />
            {children}
            <SpaceComponent height={insets.bottom} />
        </Modal>
    )
}