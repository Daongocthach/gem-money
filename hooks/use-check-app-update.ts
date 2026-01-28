import * as Linking from 'expo-linking'
import { useCallback, useEffect, useState } from 'react'

import { STORE_NAME, URL_UPDATE_APP, VERSION, VERSION_PATCH } from '@/constants'

type UpdateState = {
  hasUpdate: boolean
  latestVersion: string | null
  apkUrl: string | null
  checking: boolean
  error?: string
}

export function useCheckAppUpdate() {
  const [state, setState] = useState<UpdateState>({
    hasUpdate: false,
    latestVersion: null,
    apkUrl: null,
    checking: true,
  })

  useEffect(() => {
    checkUpdate()
  }, [])

  const checkUpdate = useCallback(async () => {
    try {
      setState((s) => ({ ...s, checking: true }))

      const localVersion = `${VERSION}.${VERSION_PATCH + 1}`

      const apkUrl = `${URL_UPDATE_APP}/${STORE_NAME}-${localVersion}.apk`

      const res = await fetch(apkUrl, { method: 'HEAD' })

      if (!res.ok) {
        setState({
          hasUpdate: false,
          latestVersion: null,
          apkUrl: null,
          checking: false,
        })
        return
      }

      setState({
        hasUpdate: true,
        latestVersion: localVersion,
        apkUrl,
        checking: false,
      })
    } catch (err: any) {
      setState({
        hasUpdate: false,
        latestVersion: null,
        apkUrl: null,
        checking: false,
        error: err.message,
      })
    }
  }, [])

  const openUpdate = useCallback(() => {
    if (state.apkUrl) {
      Linking.openURL(state.apkUrl)
    }
  }, [state.apkUrl])

  return {
    ...state,
    checkUpdate,
    openUpdate,
  }
}
