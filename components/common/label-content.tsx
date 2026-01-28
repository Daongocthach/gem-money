import { ReactNode } from 'react'

import RowComponent, { RowComponentBaseProps } from './row-component'
import TextComponent, { TextComponentProps } from './text-component'

interface LabelContentProps {
    rowProps?: RowComponentBaseProps
    labelProps?: TextComponentProps
    contentProps?: TextComponentProps
    children?: ReactNode
}

export default function LabelContent({
    rowProps,
    labelProps,
    contentProps,
    children
}: LabelContentProps) {
    if (!labelProps?.text) return null

    return (
        <RowComponent alignItems="flex-start" gap={6} {...rowProps}>
            <TextComponent
                type="label"
                {...labelProps}
            />
            
            {contentProps?.text ? (
                <TextComponent
                    type="body"
                    fontWeight='medium'
                    style={{ flexShrink: 1 }}
                    {...contentProps}
                />
            ) : null}

            {children}
        </RowComponent>
    )
}
