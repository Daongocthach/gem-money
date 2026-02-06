import { Image, ImageProps } from 'expo-image'
import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useTheme } from '@/hooks'
import IconComponent from './icon-component'
import { useImageViewerModal } from './image-viewer-modal'
import TextComponent from './text-component'

interface ImageComponentProps {
  uri?: string | null
  source?: any
  isShowViewer?: boolean
  isOutline?: boolean
  label?: string
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center'
  style?: ImageProps['style']
  debugDelayMs?: number
  cachePolicy?: ImageProps['cachePolicy']
  alt?: string
}

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

export default function ImageComponent({
  uri,
  source,
  isShowViewer = false,
  isOutline = false,
  label,
  resizeMode = 'cover',
  style,
  debugDelayMs,
  cachePolicy,
  alt = 'image',
}: ImageComponentProps) {
  const { colors } = useTheme()
  const { ImageViewerModal, open } = useImageViewerModal()

  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const imageSource = uri ? { uri } : source

  const contentFitMap = {
    cover: 'cover',
    contain: 'contain',
    stretch: 'fill',
    center: 'none',
  } as const

  const handlePress = () => {
    console.log('ImageComponent - handlePress', { uri, isShowViewer, error })
    if (uri && isShowViewer && !error) open(uri)
  }

  if (!imageSource || error) {
    return (
      <View
        style={[
          {
            width: '100%',
            height: '100%',
            borderRadius: 16,
            backgroundColor: colors.card,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: isOutline ? 1 : 0,
            borderColor: isOutline ? colors.outlineVariant : 'transparent',
          },
          style,
        ]}
      >
        <IconComponent name="ImageOff" size={24} color="onCardDisabled" />
        <TextComponent
          text="Image unavailable"
          color="onCardDisabled"
          type='caption'
          style={{ marginTop: 4 }}
        />
      </View>
    )
  }

  return (
    <View style={[{ position: 'relative' }, style]}>
      <TouchableOpacity activeOpacity={0.9} onPress={handlePress}>
        <Image
          source={imageSource}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 16,
            borderWidth: isOutline ? 1 : 0,
            borderColor: isOutline ? colors.outlineVariant : 'transparent',
          }}
          cachePolicy={cachePolicy}
          placeholder={{ blurhash }}
          contentFit={contentFitMap[resizeMode]}
          transition={300}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => {
            if (debugDelayMs) {
              setTimeout(() => setLoading(false), debugDelayMs)
            } else {
              setLoading(false)
            }
          }}
          onError={() => {
            setLoading(false)
            setError(true)
          }}
        />


        {isShowViewer && !loading && (
          <IconComponent
            name="Expand"
            size={20}
            color="onPrimary"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginLeft: -10,
              marginTop: -10,
            }}
          />
        )}
      </TouchableOpacity>

      {label && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          <TextComponent
            text={label}
            color="onPrimary"
            textAlign="center"
            numberOfLines={1}
          />
        </View>
      )}

      <ImageViewerModal />
    </View>
  )
}
