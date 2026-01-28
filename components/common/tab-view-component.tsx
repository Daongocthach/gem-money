import { StyleProp, View, ViewStyle } from 'react-native'
import { NavigationState, SceneRendererProps, TabView } from 'react-native-tab-view'

import { windowWidth } from '@/constants'
import { Route } from '@/types'
import { renderTabBar as defaultRenderTabBar } from './tab-bar-component'



interface Props {
  index: number
  setIndex: (index: number) => void
  routes: Route[]
  renderScene: (props: { route: Route }) => React.ReactNode
  initialIndex?: number
  style?: StyleProp<ViewStyle>
  renderTabBar?: (props: SceneRendererProps & { navigationState: NavigationState<Route> }) => React.ReactNode
  lazyKeys?: string[]
  isAllLazy?: boolean
}

export default function TabViewComponent({
  index,
  setIndex,
  routes,
  renderScene,
  renderTabBar = defaultRenderTabBar,
  style,
  lazyKeys = [],
  isAllLazy = false,
}: Props) {

  return (
    <View style={[{ flex: 1 }, style]}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: windowWidth }}
        renderTabBar={renderTabBar}
        lazy={({ route }) => isAllLazy || lazyKeys.includes(route.key)}
      />
    </View>
  )
}
