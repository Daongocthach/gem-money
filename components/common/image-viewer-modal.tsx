import Icon from '@/components/common/icon-component'
import ModalComponent from '@/components/common/modal-component'
import React, { useCallback, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'

export const useImageViewerModal = () => {
  const [visible, setVisible] = useState(false)
  const [imageUris, setImageUris] = useState<string[]>([])
  const [startIndex, setStartIndex] = useState(0)

  const open = useCallback((uris: string | string[] | null, index = 0) => {
    if (!uris) {
      setImageUris([])
    } else if (typeof uris === 'string') {
      setImageUris([uris])
    } else {
      setImageUris(uris)
    }
    setStartIndex(index)
    setVisible(true)
  }, [])

  const close = useCallback(() => {
    setVisible(false)
    setImageUris([])
    setStartIndex(0)
  }, [])

  const ImageViewerModal = useCallback(() => {
    const imageUrls =
      imageUris.length > 0
        ? imageUris.map((uri) => ({ url: uri }))
        : [{ url: '', props: { source: undefined } }]

    return (
      <ModalComponent visible={visible} transparent onClose={close}>
        <ImageViewer
          imageUrls={imageUrls}
          index={startIndex}
          enableSwipeDown
          onSwipeDown={close}
          renderHeader={() => (
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 35,
                right: 20,
                transform: [{ translateX: -5 }],
                zIndex: 100,
              }}
              onPress={close}
            >
              <Icon
                name="X"
                size={30}
                color="white"
              />
            </TouchableOpacity>
          )}
          backgroundColor="black"
          saveToLocalByLongPress={false}
        />
      </ModalComponent>
    )
  }, [visible, imageUris, startIndex, close])

  return { open, close, visible, ImageViewerModal }
}
