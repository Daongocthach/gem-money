import { TouchableOpacity } from "react-native"

import ChipComponent from "@/components/common/chip-component"
import ColumnComponent from "@/components/common/column-component"
import RowComponent from "@/components/common/row-component"
import TextComponent from "@/components/common/text-component"

import type { StatusConfig } from "@/types"

type SingleModeProps = {
  isSingle: true
  value: string | number
  setValue: (value: string | number) => void
}

type MultiModeProps = {
  isSingle?: false
  values: (string | number)[]
  setValues: (values: (string | number)[]) => void
}

type CommonProps = {
  selectOptions: Record<string, StatusConfig>
  label?: string
}

type ChipSelectorProps = CommonProps & (SingleModeProps | MultiModeProps)

export default function ChipSelector(props: ChipSelectorProps) {
  const { selectOptions, label } = props

  const isActive = (value: string | number) => {
    if (props.isSingle) {
      return props.value === value
    }
    return props?.values?.includes(value)
  }

  const handleSelect = (value: string | number) => {
    if (props.isSingle) {
      props.setValue(value)
      return
    }

    if (Array.isArray(props?.values) && props.values.includes(value)) {
      props.setValues(props.values.filter(item => item !== value))
    } else {
      props.setValues([...props.values, value])
    }
  }

  return (
    <ColumnComponent gap={8}>
      {label && (
        <TextComponent
          text={label}
          type="label"
        />
      )}

      <RowComponent wrap gap={6}>
        {Object.values(selectOptions).map(item => {
          const active = isActive(item.value)

          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => handleSelect(item.value)}
              activeOpacity={0.7}
              style={{ opacity: active ? 1 : 0.4 }}
            >
              <ChipComponent
                textProps={{
                  text: item?.label,
                  color: item?.color,
                }}
                iconProps={{
                  name: active ? "CircleCheck" : "Circle",
                  color: item?.color,
                }}
                rowProps={{
                  backgroundColor: item?.containerColor,
                  style: {
                    borderRadius: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  },
                }}
              />
            </TouchableOpacity>
          )
        })}
      </RowComponent>
    </ColumnComponent>
  )
}
