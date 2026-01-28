import { useEffect, useState } from 'react'
import { Keyboard } from 'react-native'

export function useKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', e => {
      setKeyboardHeight(e.endCoordinates.height)
    })
    const hide = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0)
    })

    return () => {
      show.remove()
      hide.remove()
    }
  }, [])

  return keyboardHeight
}
