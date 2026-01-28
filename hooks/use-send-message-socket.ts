import { useCallback } from 'react'

import { SOCKET_CHANNELS } from '@/constants'
import useStore from '@/store'

export function useSendMessageSocket() {
  const {
    accessToken,
    socket,
  } = useStore()

  const sendMessage = useCallback(
    (
      event: keyof typeof SOCKET_CHANNELS,
      data: Record<string, unknown>
    ) => {
      if (!socket || !accessToken) return

      if (!socket.connected) {
        socket.connect()
        socket.once('connect', () => {
          socket.emit(SOCKET_CHANNELS[event], { data })
        })
        return
      }

      socket.emit(SOCKET_CHANNELS[event], { data })
    },
    [socket, accessToken]
  )

  return { sendMessage }
}
