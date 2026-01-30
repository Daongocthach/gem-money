import { useTheme } from '@/hooks'
import useStore from '@/store'
import { getShortName } from '@/utils'
import React, { createContext, ReactNode, useContext } from 'react'
import { ColorValue, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import TextComponent from './text-component'

interface AvatarCtx {
  avatarSize: number
  displayName: string
  avatarColor?: string
}

interface AvatarProps {
  children: ReactNode
  avatarSize?: number
  userName?: string
  isMe?: boolean
  avatarColor?: string
  style?: ViewStyle
}

interface SubComponentProps {
  style?: ViewStyle
}

const AvatarCtx = createContext<AvatarCtx | null>(null)

function useAvatarCtx() {
  const ctx = useContext(AvatarCtx)
  if (!ctx) {
    throw new Error("UserAvatar sub-components must be used within a <UserAvatar /> provider")
  }
  return ctx
}

function Image() {
  const { avatarSize, displayName, avatarColor } = useAvatarCtx()
  const { colors } = useTheme()
  const shortName = getShortName(displayName)

  return (
    <View
      style={[
        styles.placeholder,
        {
          backgroundColor: (avatarColor as ColorValue) ?? colors.primary,
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          borderColor: colors.card,
        },
      ]}
    >
      <TextComponent
        text={shortName}
        type="title1"
        size={avatarSize * 0.35}
        style={{ color: '#fff' }}
      />
    </View>
  )
}

function Status({ style }: SubComponentProps) {
  const { avatarSize } = useAvatarCtx()
  const { colors } = useTheme()
  const indicatorSize = avatarSize * 0.28

  return (
    <View
      style={[
        styles.status,
        {
          width: indicatorSize,
          height: indicatorSize,
          borderRadius: indicatorSize / 2,
          backgroundColor: colors.success,
          borderColor: colors.background,
        },
        style,
      ]}
    />
  )
}

function Label({ style }: { style?: TextStyle }) {
  const { displayName } = useAvatarCtx()
  return (
    <TextComponent
      text={displayName}
      type="body"
      style={[{ marginLeft: 8 }, style]}
    />
  )
}

function UserAvatar({
  children,
  avatarSize = 50,
  userName = '',
  isMe = false,
  avatarColor,
  style,
}: AvatarProps) {
  const { userData } = useStore()
  const displayName = isMe ? userData?.full_name : userName

  return (
    <AvatarCtx.Provider value={{ avatarSize, displayName: displayName ?? '', avatarColor }}>
      <View style={[styles.container, { height: avatarSize }, style]}>
        {children}
      </View>
    </AvatarCtx.Provider>
  )
}


UserAvatar.Image = Image
UserAvatar.Status = Status
UserAvatar.Label = Label

export default UserAvatar


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  status: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
})