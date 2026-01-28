import { showAlert } from '@/alerts'
import IconComponent from '@/components/common/icon-component'
import { useTheme } from '@/hooks'
import useStore from '@/store'
import { DrawerItemProps } from '@/types'
import { DrawerItem } from '@react-navigation/drawer'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

type DrawerItemComponentProps = {
    screen: DrawerItemProps,
    isSelected?: boolean,
}

const DrawerItemComponent = ({
    screen,
    isSelected,
}: DrawerItemComponentProps) => {
    const { refreshToken, userData, signOut } = useStore()
    const { colors } = useTheme()
    const { t } = useTranslation()
    const router = useRouter()

    const handleNavigate = () => {
        if (screen.name === 'login') {
            showAlert('logout', async () => {
                signOut({ refresh_token: refreshToken })
            })
        } else {
            router.push(screen.path)
        }
    }

    return (
        <DrawerItem
            allowFontScaling={false}
            icon={({ color, size }) => (
                <IconComponent
                    name={screen.icon}
                    size={size}
                    color={
                        isSelected ?
                            colors.primary :
                            colors.icon
                    }
                />
            )}
            label={t(screen.title)}
            labelStyle={[
                {
                    color: isSelected ?
                        colors.text :
                        colors.icon,
                    marginLeft: 5,
                    fontSize: 16,
                    fontWeight: "medium",
                }
            ]}
            style={{
                borderRadius: 12,
                marginVertical: 2,
                backgroundColor: isSelected ?
                    colors.cardVariant :
                    'transparent',
            }}
            onPress={handleNavigate}
        />
    )
}

export default DrawerItemComponent

