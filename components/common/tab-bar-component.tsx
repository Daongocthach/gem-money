import { useTheme } from "@/hooks"
import ColumnComponent from "./column-component"
import RowComponent from "./row-component"
import TextComponent from "./text-component"

function TabBarComponent(props: any) {
    const { colors } = useTheme()
    const { index: activeIndex, routes } = props.navigationState

    return (
        <RowComponent style={{
            padding: 4,
            borderWidth: 1,
            borderRadius: 12,
            borderColor: colors.outline,
            backgroundColor: colors.background,
            marginBottom: 8,
        }}>
            {routes.map((route: any, index: number) => {
                const isFocused = activeIndex === index
                return (
                    <ColumnComponent
                        key={route.key}
                        justify="center"
                        style={{
                            height: 40,
                            padding: 2,
                            flex: 1,
                            borderRadius: 12,
                            backgroundColor: isFocused ? colors.primary : 'transparent',
                        }}
                        onPress={() => props.jumpTo(route.key)}
                    >
                        <TextComponent
                            numberOfLines={1}
                            textAlign="center"
                            fontWeight='medium'
                            style={{ color: isFocused ? colors.onPrimary : colors.onCardDisabled, width: '100%' }}
                            text={route.title}
                        />
                        {route?.count !== undefined &&
                            <TextComponent
                                numberOfLines={1}
                                textAlign="center"
                                size={12}
                                style={{ color: isFocused ? colors.onPrimary : colors.onCardDisabled, width: '100%' }}
                                text={route.count}
                            />
                        }
                    </ColumnComponent>
                )
            })}
        </RowComponent>
    )
}

export const renderTabBar = (props: any) => {
    return <TabBarComponent {...props} />
}

