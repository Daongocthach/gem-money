import { ReactNode } from 'react'
import Icon, { IconComponentProps } from './icon-component'
import RowComponent, { RowComponentBaseProps } from './row-component'
import TextComponent, { TextComponentProps } from './text-component'

interface Props {
    children?: ReactNode
    rowProps?: RowComponentBaseProps
    iconProps?: IconComponentProps
    textProps?: TextComponentProps
}

export default function ChipComponent(props: Props) {
    const { children, rowProps, iconProps, textProps } = props

    return (
        <RowComponent
            {...rowProps}
            gap={5}
            style={[{
                borderRadius: 5,
                paddingHorizontal: 8,
                paddingVertical: 2
            }, rowProps?.style]}
            backgroundColor={rowProps?.backgroundColor ?? "primary"}
        >
            {children}
            {iconProps?.name &&
                <Icon
                    name={iconProps.name}
                    size={iconProps.size || 16}
                    color={iconProps.color || textProps?.color || "onPrimary"}
                />
            }
            <TextComponent
                size={10}
                fontWeight='semibold'
                numberOfLines={1}
                color={iconProps?.color || textProps?.color || "onPrimary"}
                {...textProps}
            />
        </RowComponent>
    )
}