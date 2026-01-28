import { Tabs } from 'expo-router'

import { BottomTabBar, Header, IconComponent } from '@/components'
import { useTheme } from '@/hooks'

export default function TabLayout() {
  const { colors } = useTheme()

  const screens = [
    {
      name: 'index',
      title: 'home',
      icon: 'LayoutPanelLeft' as const,
    },
    {
      name: 'history',
      title: 'history',
      icon: 'ChartBar' as const,
    },
  ]

  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      {screens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
            header: () => <Header title={screen.title} />,
            tabBarIcon: ({ color }) => (
              <IconComponent size={24} name={screen.icon} color={color} />
            ),
            headerShown: true
          }}
        />
      ))}
    </Tabs>
  )
}