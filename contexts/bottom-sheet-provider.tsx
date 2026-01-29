import { useTheme } from '@/hooks'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'
import React, { createContext, useCallback, useContext, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'

interface BottomSheetContextType {
  openSheet: (content: React.ReactNode, snapPoints?: string[], isScroll?: boolean) => void
  closeSheet: () => void
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined)

export const BottomSheetProvider = ({ children }: { children: React.ReactNode }) => {
  const { colors } = useTheme()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [content, setContent] = useState<React.ReactNode>(null)
  const [dynamicSnapPoints, setDynamicSnapPoints] = useState<string[]>(['50%'])
  const [isScroll, setIsScroll] = useState<boolean>(false)

  const openSheet = useCallback((newContent: React.ReactNode, snaps?: string[], scroll?: boolean) => {
    setContent(newContent)
    if (snaps) setDynamicSnapPoints(snaps)
    if (scroll !== undefined) setIsScroll(scroll)
    bottomSheetRef.current?.expand()
  }, [])

  const closeSheet = useCallback(() => {
    bottomSheetRef.current?.close()
  }, [])

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsAt={0} appearsAt={1} pressBehavior="close" />
    ),
    []
  )

  const renderContent = () => {
    if (isScroll) {
      return <BottomSheetScrollView style={styles.contentContainer}>{content}</BottomSheetScrollView>
    }
    else {
      return <BottomSheetView style={styles.contentContainer}>{content}</BottomSheetView>
    }
  }


  return (
    <BottomSheetContext.Provider value={{ openSheet, closeSheet }}>
      {children}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={dynamicSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.modal }}
        handleIndicatorStyle={{ backgroundColor: colors.outline }}
      >
        {renderContent()}
      </BottomSheet>
    </BottomSheetContext.Provider>
  )
}

export const useAppBottomSheet = () => {
  const context = useContext(BottomSheetContext)
  if (!context) throw new Error('useAppBottomSheet must be used within a BottomSheetProvider')
  return context
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
})