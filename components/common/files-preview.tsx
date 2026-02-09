import { FlatList } from 'react-native'

import ButtonComponent from '@/components/common/button-component'
import { FileProps } from '@/types'
import RowComponent from './row-component'
import TextComponent from './text-component'

type FilesPreviewProps = {
    files: FileProps[]
    setFiles: React.Dispatch<React.SetStateAction<FileProps[]>>
  }
  
  export default function FilesPreview({ files, setFiles }: FilesPreviewProps) {
  
    const handleRemoveFile = (file: FileProps) => {
      setFiles(prev => prev.filter(item => item.uri !== file.uri))
    }
  
    if (!files || files.length === 0) return null
  
    return (
      <FlatList
        data={files}
        horizontal
        keyExtractor={(_, index) => `file-${index}`}
        renderItem={({ item }) => (
          <RowComponent
            gap={5}
            backgroundColor={'card'}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 16,
            }}
          >
            <TextComponent text={item.name} />
            <ButtonComponent
              mode="text"
              iconProps={{ name: 'X', size: 12 }}
              onPress={() => handleRemoveFile(item)}
            />
          </RowComponent>
        )}
      />
    )
  }