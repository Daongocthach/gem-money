import { useState } from 'react'
import { Image, View } from 'react-native'

import { useTheme } from '@/hooks'
import useStore from '@/store'
import { getShortName } from '@/utils'
import TextComponent from './text-component'

export default function UserAvatar({
  avatarSize = 50,
  avatarUrl = '',
  userName = '',
  isMe = false,
  avatarColor,
  notShortName = false,
}: {
  avatarSize?: number
  avatarUrl?: string
  userName?: string
  isMe?: boolean
  avatarColor?: string
  notShortName?: boolean
}) {
  const { colors } = useTheme()
  const { userData } = useStore()

  const [imageError, setImageError] = useState(false)

  const displayName = isMe ? userData?.full_name : userName
  const shortName = notShortName
    ? displayName ?? ''
    : getShortName(displayName ?? '')

  const avatarSource =
    !imageError && avatarUrl
      ? avatarUrl
      : !imageError && isMe && userData?.avatar
        ? userData.avatar
        : null

  if (avatarSource) {
    return (
      <Image
        source={{ uri: avatarSource }}
        onError={() => setImageError(true)}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: colors.primaryContainer,
        }}
        resizeMode="cover"
      />
    )
  }
  return (
    <View
      style={{
        backgroundColor: avatarColor ?? colors.primary,
        width: avatarSize,
        height: avatarSize,
        borderRadius: avatarSize / 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TextComponent
        text={shortName}
        type="title1"
        size={avatarSize * 0.3}
        style={{
          color: '#fff',
          lineHeight: avatarSize * 0.4,
        }}
      />
    </View>
  )
}
