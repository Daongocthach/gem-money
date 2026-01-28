import { useEffect, useRef } from 'react'
import { AppState } from 'react-native'
import { io, Socket } from 'socket.io-client'

import useStore from '@/store'

export function useSocket() {
  const {
    accessToken,
    socket,
    setSocket,
    setActionName,
  } = useStore()

  const appState = useRef(AppState.currentState)

  useEffect(() => {
    if (!accessToken) {
      if (socket) {
        socket.removeAllListeners()
        socket.disconnect()
        setSocket(null)
      }
      return
    }

    if (socket) {
      socket.removeAllListeners()
      socket.disconnect()
      setSocket(null)
    }

    const socketInstance: Socket = io('https://', {
      path: '/socket.io/',
      transports: ['websocket'],
      auth: { token: accessToken },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
      autoConnect: true,
    })

    socketInstance.on('connect', () => {
      setActionName('isSocketConnected', true)
    })

    socketInstance.on('disconnect', reason => {
      setActionName('isSocketConnected', false)
    })

    socketInstance.on('connect_error', err => {
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.removeAllListeners()
      socketInstance.disconnect()
    }
  }, [accessToken])

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        if (socket && !socket.connected) {
          socket.connect()
        }
      }
      appState.current = nextState
    })

    return () => sub.remove()
  }, [socket])
}
