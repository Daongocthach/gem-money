
import { usePathname } from 'expo-router'
import { View } from 'react-native'

import ColumnComponent from '@/components/common/column-component'
import TextComponent from '@/components/common/text-component'
import { useTheme } from '@/hooks'
import { DrawerItemProps } from '@/types'
import DrawerItemComponent from './drawer-item-component'

interface DrawerSectionProps {
    title: string
    items: DrawerItemProps[]
}

export default function DrawerSection({ title, items }: DrawerSectionProps) {
    const pathname = usePathname()
    const { colors } = useTheme()

    return (
        <ColumnComponent>
            <View
                style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: colors.outlineVariant,
                }}
            />

            <ColumnComponent style={{ marginTop: 10 }}>
                <TextComponent
                    size={12}
                    color={colors.icon}
                    text={title}
                    fontWeight="medium"
                    style={{ textTransform: 'uppercase' }}
                />
                {items.map((screen) => (
                    <DrawerItemComponent
                        key={screen.name}
                        screen={screen}
                        isSelected={pathname === screen.path}
                    />
                ))}
            </ColumnComponent>
        </ColumnComponent>
    )
}