import React, { createContext, ReactNode, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewProps } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'

import { FONT_FAMILIES, windowHeight } from '@/constants'
import { useTheme } from "@/hooks"
import i18next from '@/locales'
import { DropdownProps } from '@/types'

import ButtonComponent from './button-component'
import ColumnComponent from './column-component'
import Icon from './icon-component'
import RowComponent from './row-component'
import TextComponent from './text-component'

interface DropdownCtx {
  dataTranslated: DropdownProps[]
  selected: string
  setSelected: (value: string) => void
  disabled: boolean
  safeValue: string
}

const DropdownCtx = createContext<DropdownCtx | null>(null)

function useDropdownCtx() {
  const ctx = useContext(DropdownCtx)
  if (!ctx) throw new Error("Dropdown sub-components must be used within <InlineDropdown />")
  return ctx
}


function Label({ text }: { text?: string }) {
  if (!text) return null
  return <TextComponent text={text} type="label" style={{ marginBottom: 4 }} />
}

function Clear({ onPress }: { onPress?: () => void }) {
  const { setSelected, safeValue } = useDropdownCtx()

  if (!safeValue) return null

  const handleClear = () => {
    setSelected('')
    onPress?.()
  }

  return (
    <View style={styles.clearContainer}>
      <ButtonComponent
        mode="text"
        iconProps={{ name: 'X', size: 20 }}
        onPress={handleClear}
      />
    </View>
  )
}

interface MainInputProps {
  placeholder?: string
  isClearable?: boolean
  isLoading?: boolean
  style?: ViewProps['style']
  onOpen?: () => void
  autoScroll?: boolean
  isSearch?: boolean
  searchPlaceholder?: string
  flatListProps?: any
}

function MainInput({
  placeholder = 'select an option',
  isClearable,
  isLoading,
  style,
  onOpen,
  autoScroll,
  isSearch,
  searchPlaceholder = 'search',
  flatListProps
}: MainInputProps) {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const {
    dataTranslated,
    selected,
    setSelected,
    disabled,
    safeValue
  } = useDropdownCtx()

  return (
    <Dropdown
      disable={disabled}
      data={dataTranslated}
      labelField="label"
      valueField="value"
      value={safeValue}
      placeholder={t(placeholder)}
      autoScroll={autoScroll}
      search={isSearch}
      onChange={(item: DropdownProps) => setSelected(item.value)}
      onFocus={() => { onOpen?.() }}
      style={[
        styles.dropdown,
        {
          borderColor: colors.outlineVariant,
          backgroundColor: colors.background,
          opacity: disabled ? 0.5 : 1
        },
        style
      ]}
      placeholderStyle={{
        color: colors.onCardDisabled,
        fontSize: 13,
        fontFamily: FONT_FAMILIES.REGULAR
      }}
      selectedTextStyle={{
        color: colors.onCardVariant,
        fontSize: 13,
        fontFamily: FONT_FAMILIES.REGULAR,
        paddingRight: 30
      }}
      selectedTextProps={{
        numberOfLines: 1,
        allowFontScaling: false
      }}
      searchPlaceholder={t(searchPlaceholder)}
      inputSearchStyle={{
        color: colors.onBackground,
        borderRadius: 8
      }}
      containerStyle={{
        maxHeight: windowHeight * 0.6,
        borderRadius: 8,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.cardDisabled,
      }}
      activeColor={colors.cardVariant}
      renderRightIcon={() => (
        <RowComponent gap={10}>
          {!isLoading && isClearable && !!safeValue && (
            <ButtonComponent
              mode="text"
              iconProps={{ name: 'X' }}
              onPress={() => setSelected('')}
            />
          )}
          <Icon name="ChevronDown" size={18} color="onCard" />
        </RowComponent>
      )}
      renderItem={(item) => {
        const isSelected = item.value === safeValue
        return (
          <RowComponent
            alignItems="center"
            justify="space-between"
            style={[
              styles.item,
              {
                borderBottomColor: colors.card
              }
            ]}
          >
            <TextComponent
              text={item.label}
              color={isSelected ? "primary" : "onBackground"}
              style={{ flexShrink: 1 }}
            />
            {isSelected && <Icon name="Check" size={16} color="primary" />}
          </RowComponent>
        )
      }}
      flatListProps={flatListProps}
    />
  )
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null
  return <TextComponent type='caption' text={message} color='error' style={{ marginTop: 4 }} />
}

interface InlineDropdownProps {
  children: ReactNode
  selects: DropdownProps[]
  selected: string
  setSelected: (value: string) => void
  disabled?: boolean
  viewStyle?: ViewProps['style']
}

function InlineDropdown({
  children,
  selects,
  selected,
  setSelected,
  disabled = false,
  viewStyle,
}: InlineDropdownProps) {
  const { t } = useTranslation()

  const dataTranslated = useMemo(
    () => selects.map(data => ({ ...data, label: i18next.exists(data.label) ? t(data.label) : data.label })),
    [selects, t]
  )

  const safeValue = useMemo(() => {
    return dataTranslated.some(data => data.value === selected) ? selected : ''
  }, [dataTranslated, selected])

  const childrenArray = React.Children.toArray(children)
  const clearButton = childrenArray.filter(
    (child: any) => child.type === Clear
  )

  return (
    <DropdownCtx.Provider
      value={{
        dataTranslated,
        selected,
        setSelected,
        disabled,
        safeValue
      }}
    >
      <ColumnComponent style={viewStyle}>
        <View style={{ position: 'relative' }}>
          {children}
        </View>
      </ColumnComponent>
    </DropdownCtx.Provider>
  )
}

InlineDropdown.Label = Label
InlineDropdown.Input = MainInput
InlineDropdown.Error = ErrorMessage
InlineDropdown.Clear = Clear

export default InlineDropdown

const styles = StyleSheet.create({
  dropdown: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  clearContainer: {
    position: 'absolute',
    right: 35,
    top: 22,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 10,
  },
})