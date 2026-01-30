import React, { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View, ViewStyle } from 'react-native'
import { MultiSelect } from 'react-native-element-dropdown'

import { FONT_FAMILIES, windowHeight } from '@/constants'
import { useTheme } from "@/hooks"
import Checkbox from './check-box'
import ColumnComponent from './column-component'
import Icon from './icon-component'
import RowComponent from './row-component'
import TextComponent from './text-component'
import TextInputComponent from './text-input-component'

interface MultiSelectDropdownProps {
  selects: { label: string, value: string }[]
  selected: string[]
  setSelected: (values: string[]) => void
  label?: string
  placeholder?: string
  style?: object
  viewStyle?: ViewStyle
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
}

export default function MultiSelectDropdown({
  selects,
  selected = [],
  setSelected,
  label,
  placeholder = 'select options',
  style,
  viewStyle,
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
}: MultiSelectDropdownProps) {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const triggerRef = useRef<View>(null)
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom')

  const dataTranslated = useMemo(
    () => selects.map(data => ({ ...data, label: t(data.label) })),
    [selects, t]
  )

  const handleChange = (selected: any) => {
    const values: string[] = Array.isArray(selected)
      ? selected.map((it: any) => (typeof it === 'string' ? it : it?.value)).filter(Boolean)
      : []
    setSelected(values)
  }
  const updateDropdownPosition = () => {
    triggerRef.current?.measureInWindow((_, y, __, h) => {
      const centerY = y + h / 2
      setDropdownPosition(
        centerY > windowHeight / 2 ? 'top' : 'bottom'
      )
    })
  }


  return (
    <ColumnComponent gap={4} style={[viewStyle]}>
      {label && (
        <TextComponent
          text={label}
          type="label"
        />
      )}
      <View
        ref={triggerRef}
        onLayout={() => {
          triggerRef.current?.measureInWindow((x, y, w, h) => {
            const triggerCenterY = y + h / 2
            const isBelowHalf = triggerCenterY > windowHeight / 2
            setDropdownPosition(isBelowHalf ? 'top' : 'bottom')
          })
        }}
      >
        <MultiSelect
          disable={disabled}
          data={dataTranslated}
          labelField="label"
          valueField="value"
          value={selected}
          placeholder={t(placeholder)}
          search={isSearch}
          onChange={handleChange}
          dropdownPosition={dropdownPosition}
          keyboardAvoiding={false}
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
            borderRadius: 8,
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.cardDisabled,
            marginBottom: 10,
          }}
          activeColor={colors.cardVariant}
          renderRightIcon={() => (
            <Icon name="ChevronDown" size={18} color="onCard" />
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
            const checked = selected.includes(item.value)
            return (
              <RowComponent
                alignItems="center"
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.card,
                }}
              >
                <Checkbox
                  checked={checked}
                  setChecked={() => {
                    if (checked) {
                      setSelected(selected.filter(selectedItem => selectedItem !== item.value))
                    } else {
                      setSelected([...(selected as string[]), item.value])
                    }
                  }}
                  style={{ marginRight: 10 }}
                />
                <TextComponent
                  text={item.label}
                  color={checked ? "primary" : "onBackground"}
                />
              </RowComponent>
            )
          }}

          renderSelectedItem={(item, unSelect) => (
            <RowComponent
              key={item.value}
              alignItems="center"
              style={{
                paddingVertical: 4,
                paddingHorizontal: 8,
                backgroundColor: colors.card,
                borderRadius: 16,
                marginTop: 8,
                marginBottom: 2,
                marginRight: 6,
              }}
            >
              <TextComponent
                text={item.label}
                numberOfLines={1}
                style={{ maxWidth: 120 }}
              />
              <TouchableOpacity
                onPress={() => {
                  unSelect && unSelect(item)
                  setSelected(selected.filter((select: string) => select !== item.value))
                }}
                style={{ marginLeft: 6 }}
              >
                <Icon name="X" size={14} color="primary" />
              </TouchableOpacity>
            </RowComponent>
          )}
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