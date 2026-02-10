import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { SQLiteProvider } from 'expo-sqlite'
import { StatusBar } from 'expo-status-bar'
import { Suspense, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { LoadingScreen } from '@/components'
import { FONT_FAMILIES } from '@/constants'
import { BottomSheetProvider } from '@/contexts/bottom-sheet-provider'
import { GlobalAlertProvider } from '@/contexts/global-alert-provider'
import { ThemeProvider } from '@/contexts/theme-provider'
import { migrateDbIfNeeded } from '@/database/db'
import { useTheme } from '@/hooks'
import i18next from '@/locales'
import useStore from '@/store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      retry: 0,
    },
    mutations: {
      retry: 0,
    }
  },
})

SplashScreen.preventAutoHideAsync()

const screens = [
  '(tabs)',
  'no-access',
  'profile',
  'notifications',
  'incomes',
  'transactions',
  'manage-jars',
]

const authenScreens = [
  'login',
]

export default function RootLayout() {
  const { darkMode } = useStore()
  const {colors} = useTheme()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [loaded] = useFonts({
    [FONT_FAMILIES.REGULAR]: require('../assets/fonts/Poppins-Regular.ttf'),
    [FONT_FAMILIES.MEDIUM]: require('../assets/fonts/Poppins-Medium.ttf'),
    [FONT_FAMILIES.SEMIBOLD]: require('../assets/fonts/Poppins-SemiBold.ttf'),
    [FONT_FAMILIES.BOLD]: require('../assets/fonts/Poppins-Bold.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded, router])

  if (!loaded) {
    return <LoadingScreen />
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <QueryClientProvider client={queryClient}>
        <SQLiteProvider databaseName="gem_money.db" onInit={migrateDbIfNeeded} useSuspense>
          <ThemeProvider>
            <GestureHandlerRootView>
              <BottomSheetProvider>
                <GlobalAlertProvider>
                  <I18nextProvider i18n={i18next}>
                    <Stack
                      screenOptions={{
                        animation: 'slide_from_right',
                        contentStyle: {
                          backgroundColor: colors.background,
                        }
                      }}
                    >
                      {screens.map((screen) => (
                        <Stack.Screen
                          key={screen}
                          name={screen}
                          options={{
                            headerShown: false,
                          }} />
                      ))}

                      {authenScreens.map((screen) => (
                        <Stack.Screen
                          key={screen}
                          name={screen}
                          options={{
                            headerShown: false,
                            contentStyle: {
                              paddingTop: insets.top,
                              backgroundColor: colors.background,
                            }
                          }}
                        />))}

                    </Stack>
                    <Toast />
                  </I18nextProvider>
                </GlobalAlertProvider>
              </BottomSheetProvider>
            </GestureHandlerRootView>
            <StatusBar backgroundColor='#000' style={darkMode ? 'light' : 'dark'} />
          </ThemeProvider>
        </SQLiteProvider>
      </QueryClientProvider>
    </Suspense>
  )
}