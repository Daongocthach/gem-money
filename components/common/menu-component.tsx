import { useTheme } from "@/hooks"
import React, { ReactElement, ReactNode, useRef, useState } from "react"
import { Pressable, View, ViewStyle } from "react-native"
import Popover from "react-native-popover-view"

type MenuRenderCtx = { close: () => void }

interface MenuComponentProps {
  children: ReactNode
  menuChildren: ReactNode | ((ctx: MenuRenderCtx) => ReactNode)
  viewStyle?: ViewStyle
  triggerStyle?: ViewStyle
  disabled?: boolean
}

const MenuComponent = ({
  children,
  menuChildren,
  viewStyle,
  triggerStyle,
  disabled = false,
}: MenuComponentProps): ReactElement => {
  const { colors } = useTheme()
  const [visible, setVisible] = useState(false)
  
  const touchableRef = useRef<View>(null)

  const close = () => setVisible(false)

  const renderMenu = () => {
    if (typeof menuChildren === "function") {
      return (menuChildren as (ctx: MenuRenderCtx) => ReactNode)({ close })
    }
    return menuChildren
  }

  return (
    <View style={viewStyle} collapsable={false}>
      <Pressable
        ref={touchableRef}
        collapsable={false}
        onPress={() => setVisible(true)}
        disabled={disabled}
        style={({ pressed }) => [
          { opacity: pressed ? 0.8 : 1 },
          triggerStyle,
        ]}
      >
        {children}
      </Pressable>

      <Popover
        isVisible={visible}
        onRequestClose={close}
        from={touchableRef as any}
        backgroundStyle={{ backgroundColor: "transparent" }}
        offset={6}
        arrowSize={{ width: 0, height: 0 }}
        popoverStyle={{
          backgroundColor: 'transparent',
          borderWidth: 0,
          shadowColor: 'transparent',
          elevation: 0,
        }}
        animationConfig={{ duration: 100 }}
      >
        <View
          style={{
            flexGrow: 0,
            backgroundColor: colors.background,
            padding: 12,  
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.outline,
            minWidth: 120,
          }}
        >
          {renderMenu()}
        </View>
      </Popover>
    </View>
  )
}

export default MenuComponent