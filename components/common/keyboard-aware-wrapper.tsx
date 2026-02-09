import React from "react"
import {
  Platform,
  StyleProp,
  View,
  ViewStyle
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
      // Giúp bấm vào nút mà không bị mất focus/phải bấm 2 lần
      keyboardShouldPersistTaps="handled" 
      
      // Quan trọng: Cho phép scroll kể cả khi bàn phím đang mở
      keyboardDismissMode="on-drag" 
      
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={Platform.OS === "android" ? extraScrollHeight : 90}
      extraHeight={Platform.OS === "android" ? extraHeight : 80}
      contentContainerStyle={[
        { paddingBottom: 120 },
        contentContainerStyle,
      ]}
      style={style}
    >
      {/* Xóa bỏ TouchableWithoutFeedback ở đây. 
         Nếu muốn chạm vùng trống để ẩn phím, keyboardShouldPersistTaps="handled" 
         của ScrollView đã hỗ trợ phần lớn trải nghiệm này.
      */}
      <View>{children}</View>
    </KeyboardAwareScrollView>
  )
}