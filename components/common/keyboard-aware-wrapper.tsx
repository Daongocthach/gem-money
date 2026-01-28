import React from "react"
import {
  Keyboard,
  Platform,
  StyleProp,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

interface Props {
  children: React.ReactNode
  contentContainerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  extraScrollHeight?: number
  extraHeight?: number
}

export default function KeyboardAwareWrapper({
  children,
  style,
  contentContainerStyle,
  extraScrollHeight = 50,
  extraHeight = 90,
}: Props) {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={Platform.OS === "android" ? extraScrollHeight : 90}
      extraHeight={Platform.OS === "android" ? extraHeight : 80}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        { paddingBottom: 120 },
        contentContainerStyle,
      ]}
      style={style}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>{children}</View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  )
}
