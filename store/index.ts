import { router } from "expo-router"
import { Socket } from "socket.io-client"
import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

import i18next from "@/locales"
import { asyncStorage } from "@/store/storage"
import { LanguageProps, User } from "@/types"

type StoreState = {
  darkMode: boolean
  currentLanguage: LanguageProps
  isLoading: boolean
  isLoggedIn: boolean
  userData: User | null
  accessToken: string
  refreshToken: string
  isSocketConnected: boolean
  socket: Socket | null
  isDevMode: boolean
  signIn: (userData: User) => void
  signOut: (payload: { refresh_token: string }) => void
  setSocket: (socket: Socket | null) => void
  changeLanguage: (language: LanguageProps) => void
  setDarkMode: (payload: boolean) => void
  setActionName: <key extends keyof StoreState>(key: key, value: StoreState[key]) => void
}

const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        darkMode: false,
        currentLanguage: "en",
        isLoading: false,
        isLoggedIn: false,
        userData: null,
        accessToken: "",
        refreshToken: "",
        isSocketConnected: false,
        socket: null,
        isDevMode: false,
        signIn: (userData) => {
          set({
            userData,
            accessToken: userData.access_token || "",
            refreshToken: userData.refresh_token || "",
            isLoggedIn: true
          })
        },
        signOut: async () => {
          set({
            userData: null,
            accessToken: "",
            refreshToken: "",
            isLoggedIn: false,
          })
          router.replace('/login')
        },
        setSocket: (socket) => {
          set({ socket })
        },
        setDarkMode: (payload) => {
          set({ darkMode: payload })
        },
        changeLanguage: (language: LanguageProps) => {
          set({ currentLanguage: language })
          i18next.changeLanguage(language)
        },
        setActionName: (key, value) => {
          set({ [key]: value })
        },
      }),
      {
        name: "gem-money-store",
        storage: createJSONStorage(() => asyncStorage),
        partialize: (state) => ({
          darkMode: state.darkMode,
          currentLanguage: state.currentLanguage,
          isLoggedIn: state.isLoggedIn,
          userData: state.userData,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isDevMode: state.isDevMode,
        }),
      },
    ),
  ),
)

export default useStore
