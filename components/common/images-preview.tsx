import { FlatList, View } from 'react-native'

import ButtonComponent from '@/components/common/button-component'
import ImageComponent from '@/components/common/image-component'
import { FileProps } from '@/types'

type ImagesPreviewProps = {
  images: FileProps[]
  setImages: React.Dispatch<React.SetStateAction<FileProps[]>>
}

export default function ImagesPreview({ images, setImages }: ImagesPreviewProps) {

  const handleRemoveFile = (file: FileProps) => {
    setImages(prev => prev.filter(item => item.uri !== file.uri))
  }

  if (!images || images.length === 0) return null

  return (
    <FlatList
      data={images}
      horizontal
      keyExtractor={(_, index) => `image-${index}`}
      renderItem={({ item }) => (
        <View style={{ position: 'relative' }}>
          <ImageComponent
            uri={item.uri}
            style={{
              width: 50,
              height: 50,
              borderRadius: 16,
              marginRight: 8,
            }}
            isShowViewer
          />
          <ButtonComponent
            mode="text"
            iconProps={{ name: 'X', size: 12 }}
            onPress={() => handleRemoveFile(item)}
            style={{
              position: 'absolute',
              top: 2,
              right: 10,
              borderRadius: 10,
              backgroundColor: 'white'
            }}
          />
        </View>
      )}
    />
  )
}