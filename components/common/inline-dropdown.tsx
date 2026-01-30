import React, { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewProps } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { FONT_FAMILIES, windowHeight } from '@/constants'
import { useTheme } from "@/hooks"
import { DropdownProps } from '@/types'

import i18next from '@/locales'
import ButtonComponent from './button-component'
import ColumnComponent from './column-component'
import Icon from './icon-component'
import RowComponent from './row-component'
import TextComponent from './text-component'
import TextInputComponent from './text-input-component'

interface InlineDropdownProps {
  selects: DropdownProps[]
  selected: string | number
  setSelected: (value: any) => void
  label?: string
  placeholder?: string
  style?: ViewProps['style']
  viewStyle?: ViewProps['style']
  isClearable?: boolean
  isSearch?: boolean
  isSearchCustom?: boolean
  searchCustomValue?: string
  setSearchCustomValue?: (value: string) => void
  searchPlaceholder?: string
  disabled?: boolean
  onOpen?: () => void
  hideFooter?: boolean
  errorMessage?: string
  loadMore?: () => void
  isLoading?: boolean
  isFetchingNextPage?: boolean
  isError?: boolean
  hasMore?: boolean
  autoScroll?: boolean
}

export default function InlineDropdown({
  selects,
  selected,
  setSelected,
  label,
  placeholder = 'select an option',
  style,
  viewStyle,
  isClearable = false,
  isSearch = false,
  isSearchCustom = false,
  searchCustomValue,
  setSearchCustomValue,
  searchPlaceholder = 'search',
  disabled = false,
  onOpen,
  hideFooter = false,
  errorMessage,
  loadMore,
  isLoading = false,
  isFetchingNextPage = false,
  hasMore = false,
  isError = false,
  autoScroll = false,
}: InlineDropdownProps) {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const { colors } = useTheme()
  const triggerRef = useRef<View>(null)
  const [triggerLayout, setTriggerLayout] = useState<{
    y: number
    height: number
  }>({ y: 0, height: 0 })
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom')

  const dataTranslated = useMemo(
    () => selects.map(data => ({ ...data, label: i18next.exists(data.label) ? t(data.label) : data.label })),
    [selects, t]
  )

  const safeValue = useMemo(() => {
    return dataTranslated.some(data => data.value === selected) ? selected : ''
  }, [dataTranslated, selected])

  const updateDropdownPosition = () => {
    triggerRef.current?.measureInWindow((_, y, __, h) => {
      setTriggerLayout({ y, height: h })

      const centerY = y + h / 2
      setDropdownPosition(
        centerY > (windowHeight - insets.top - insets.bottom) / 2
          ? 'top'
          : 'bottom'
      )
    })
  }

  const maxDropdownHeight = dropdownPosition === 'top'
    ? triggerLayout.y - insets.top - 8
    : windowHeight - triggerLayout.y - triggerLayout.height - insets.bottom - 8

  return (
    <ColumnComponent gap={4} style={viewStyle}>
      {label && (
        <TextComponent
          text={label}
          type="label"
        />
      )}

      <View
        style={{ position: 'relative' }}
        ref={triggerRef}
        onLayout={() => {
          triggerRef.current?.measureInWindow((x, y, w, h) => {
            const triggerCenterY = y + h / 2
            const isBelowHalf = triggerCenterY > windowHeight / 2
            setDropdownPosition(isBelowHalf ? 'top' : 'bottom')
          })
        }}
      >
        <Dropdown
          disable={disabled}
          data={dataTranslated}
          labelField="label"
          valueField="value"
          value={safeValue}
          placeholder={t(placeholder)}
          autoScroll={autoScroll}
          search={isSearch}
          dropdownPosition={dropdownPosition}
          onChange={(item: DropdownProps) => setSelected(item.value)}
          style={[
            {
              height: 44,
              borderWidth: 1,
              borderColor: colors.outlineVariant,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 10,
              backgroundColor: colors.background,
              opacity: disabled ? 0.5 : 1,
            },
            style as any,
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
            paddingRight: 30,
          }}
          selectedTextProps={{ numberOfLines: 1, allowFontScaling: false }}
          searchPlaceholder={t(searchPlaceholder)}
          inputSearchStyle={{
            color: colors.onBackground,
            borderRadius: 8,
          }}
          containerStyle={{
            maxHeight: Math.max(120, maxDropdownHeight),
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
                  isIconOnly
                  iconProps={{ name: 'X' }}
                  onPress={() => setSelected('')}
                />
              )}
              <Icon name="ChevronDown" size={18} color="onCard" />
            </RowComponent>
          )}
          onFocus={() => {
            updateDropdownPosition()
            onOpen?.()
          }}
          flatListProps={{
            onEndReached: () => loadMore?.(),
            onEndReachedThreshold: 0.5,
            stickyHeaderIndices: isSearchCustom ? [0] : [],
            ListHeaderComponent: isSearchCustom ? (
              <View style={{ padding: 4 }}>
                <TextInputComponent
                  value={searchCustomValue}
                  onChangeText={setSearchCustomValue}
                  placeholder={t(searchPlaceholder)}
                >
                  <TextInputComponent.RightGroup>
                    <TextInputComponent.Clear />
                  </TextInputComponent.RightGroup>
                </TextInputComponent>
              </View>
            ) : null,
            ListEmptyComponent: hideFooter ? null :
              (!isLoading && selects?.length === 0) ? (
                <TextComponent
                  textAlign='center'
                  type='caption'
                  text={isError ? 'error loading data' : 'no data found'}
                  style={{ marginVertical: 16 }}
                />
              ) : null,
            ListFooterComponent: hideFooter ? null :
              (isLoading && selects?.length === 0) ? (
                <TextComponent
                  textAlign='center'
                  type='caption'
                  text="loading"
                  style={{ marginVertical: 16 }}
                />
              ) : (isFetchingNextPage) ? (
                <TextComponent
                  textAlign='center'
                  type='caption'
                  text="loading more"
                  style={{ marginVertical: 16 }}
                />
              ) : (!hasMore && selects?.length > 0) ? (
                <TextComponent
                  textAlign='center'
                  type='caption'
                  text="end of page"
                  style={{ marginVertical: 16 }}
                />
              ) : null
          }}
          renderItem={(item) => {
            const isSelected = item.value === safeValue

            return (
              <RowComponent
                alignItems="center"
                justify="space-between"
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.card,
                }}
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
        />
      </View>
      {errorMessage && (
        <TextComponent
          type='caption'
          text={errorMessage}
          color='error'
        />
      )}
    </ColumnComponent>
  )
}