import ColumnComponent from "@/components/common/column-component"
import ImageComponent from "@/components/common/image-component"
import TextComponent from "@/components/common/text-component"
import React, { createContext, ReactNode, useContext } from 'react'
import { ImageSourcePropType, StyleSheet, ViewStyle } from "react-native"

interface OverviewCtx {
  imageSource?: ImageSourcePropType
  title?: string
  caption?: string
}

interface OverviewProps {
  children: ReactNode
  imageSource?: ImageSourcePropType
  title?: string
  caption?: string
  style?: ViewStyle
  gap?: number
}

interface SubComponentProps {
  style?: any
}

const OverviewCtx = createContext<OverviewCtx | null>(null)

function useOverviewCtx() {
  const ctx = useContext(OverviewCtx)
  if (!ctx) {
    throw new Error("Overview sub-components must be used within an <Overview /> provider")
  }
  return ctx
}

function Banner({ style }: SubComponentProps) {
  const { imageSource } = useOverviewCtx()
  if (!imageSource) return null

  return (
    <ImageComponent
      source={imageSource}
      style={[styles.banner, style]}
      resizeMode="contain"
    />
  )
}

function Title({ style }: SubComponentProps) {
  const { title } = useOverviewCtx()
  if (!title) return null

  return (
    <TextComponent
      text={title}
      textAlign='center'
      type='title'
      style={style}
    />
  )
}

function Caption({ style }: SubComponentProps) {
  const { caption } = useOverviewCtx()
  if (!caption) return null

  return (
    <TextComponent
      text={caption}
      type="label"
      textAlign='center'
      style={style}
    />
  )
}


function Overview({ 
  children, 
  imageSource, 
  title, 
  caption, 
  style, 
  gap = 5 
}: OverviewProps) {
  return (
    <OverviewCtx.Provider value={{ imageSource, title, caption }}>
      <ColumnComponent 
        gap={gap} 
        style={style}
      >
        {children}
      </ColumnComponent>
    </OverviewCtx.Provider>
  )
}


Overview.Banner = Banner
Overview.Title = Title
Overview.Caption = Caption

export default Overview


const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: 180,
  },
})