import { createContext, ReactNode } from 'react'

import { darkTheme, lightTheme } from '@/constants'
import useStore from '@/store'
import { AppTheme } from '@/types'

export const ThemeContext = createContext<AppTheme>(lightTheme)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { darkMode } = useStore()
  const theme = darkMode ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}