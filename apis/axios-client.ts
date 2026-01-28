import axios from 'axios'
import { router } from 'expo-router'
import { jwtDecode } from 'jwt-decode'
import { Alert, Platform } from 'react-native'

import { showAlert, showAlertWithCustomText, showToast } from '@/alerts'
import { URL_FINEPRO } from '@/constants'
import useStore from '@/store'
import { TokenDecodedProps } from '@/types'
import { arrayParamsSerializer } from '@/utils'

const axiosClient = axios.create()

axiosClient.interceptors.request.use(
  async (config) => {

    const { accessToken, refreshToken } = useStore.getState()
    const nowURL = URL_FINEPRO + '/api/v1/'

    config.baseURL = nowURL
    config.headers.Accept = 'application/json'
    config.paramsSerializer = arrayParamsSerializer

    if (!accessToken) {
      return config
    }
    const now = Math.floor(Date.now() / 1000)
    const decodedToken = jwtDecode<TokenDecodedProps>(accessToken)

    if (decodedToken?.exp && decodedToken?.exp < now) {
      try {
        const response = await axios.post(
          `${nowURL}auth/refresh/`,
          { refresh_token: refreshToken }
        )
        if (response) {
          useStore.setState({ accessToken: response.data.data.access_token })
          useStore.setState({ refreshToken: response.data.data.refresh_token })
          config.headers.Authorization = `Bearer ${response.data.data.access_token}`
        }
      } catch (error) {
        
        router.replace('/login')
        useStore.setState({ accessToken: '', refreshToken: '', userData: null, isLoggedIn: false })
        showAlert("refresh_token_failed")
      }
    }
    else {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status
    const errorMessage = error.response?.data?.message || error.message || 'something went wrong'

    if (!error.response) {
      showToast('network_error')
      return Promise.reject(new Error('network error'))
    }

    if (statusCode === 403) {
      Platform.OS === 'android'
        ? showAlertWithCustomText('you do not have access to this page', errorMessage, 'error')
        : Alert.alert('Access Denied', errorMessage)
      router.replace('/no-access')
    }
    else if (statusCode === 401) {
      useStore.setState({ accessToken: '', refreshToken: '', userData: null, isLoggedIn: false })
      Platform.OS === 'android'
        ? showAlertWithCustomText('session expired', errorMessage, 'warning')
        : Alert.alert('Session expired', errorMessage)
      return
    }
    else {
      Platform.OS === 'android'
        ? showAlertWithCustomText('error', errorMessage, 'error')
        : Alert.alert('Error', errorMessage)
    }

    return Promise.reject(new Error(errorMessage))
  }
)



export default axiosClient