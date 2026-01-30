import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer"
import { useRouter } from "expo-router"
import { Drawer } from "expo-router/drawer"
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import {
    DrawerSection,
    Header,
    TextComponent,
    UserAvatar
} from "@/components"
import { VERSION, VERSION_PATCH, } from "@/constants"
import { useTheme } from "@/hooks"
import { DrawerItemProps } from "@/types"

const stackScreens: DrawerItemProps[] = [
    { name: "profile", title: "profile", icon: "UserRound", path: "/" },
    { name: "notifications", title: "notifications", icon: "UserRound", path: "/" },
]

const drawerScreens: DrawerItemProps[] = [

]

const systemScreen: DrawerItemProps[] = [
    { name: "settings", title: "settings", icon: "Cog", path: "/settings" },
]

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const router = useRouter()
    const { colors } = useTheme()

    return (
        <DrawerContentScrollView {...props}>
            <View style={{ position: 'relative' }}>
                <TouchableOpacity
                    style={[styles.headerContainer, { backgroundColor: colors.cardVariant }]}
                    onPress={() => router.push('/profile')}
                >
                    <UserAvatar userName="Guest" avatarSize={40}>
                        <UserAvatar.Label />
                        <UserAvatar.Status />
                    </UserAvatar>
                </TouchableOpacity>

                <DrawerSection title='main' items={[...drawerScreens]} />
                <DrawerSection title='system' items={[
                    ...systemScreen,
                    { name: "login", title: "logout", icon: "LogOut", path: "/login" }
                ]} />
                <TextComponent
                    type="caption"
                    color='onCardDisabled'
                    text={VERSION + "." + VERSION_PATCH}
                    style={{ textTransform: 'uppercase' }}
                />
            </View>
        </DrawerContentScrollView>
    )
}


export default function DrawerLayout() {
    const { colors } = useTheme()

    return (
        <Drawer
            initialRouteName="(tabs)"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerPosition: 'right',
                drawerStyle: { width: "70%", backgroundColor: colors.background },
                sceneStyle: { backgroundColor: colors.background },
            }}
        >
            <Drawer.Screen
                name={"(tabs)"}
                options={{ headerShown: false }}
            />
            {stackScreens.map(screen => (
                <Drawer.Screen
                    key={screen.name}
                    name={screen.name}
                    options={{
                        header: () => <Header title={screen.title ?? ""} />,
                    }}
                />
            ))}
            {[...drawerScreens, ...systemScreen].map(screen => (
                <Drawer.Screen
                    key={screen.name}
                    name={screen.name}
                    options={{
                        header: () => <Header title={screen.title ?? ""} />,
                    }}
                />
            ))}
        </Drawer>
    )
}


const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        backfaceVisibility: 'hidden',
    },
    headerContainer: {
        padding: 12,
        borderRadius: 5,
        marginBottom: 8,
    },
})
