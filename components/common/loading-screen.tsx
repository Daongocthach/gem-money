import IMAGES from '@/assets/images'
import { Image, View, ViewProps } from 'react-native'
import TextComponent from './text-component'

interface LoadingProps extends ViewProps {
    progress?: number
}

const LoadingScreen = ({ progress, ...props }: LoadingProps) => {
    return (
        <View
            style={[
                {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 40,
                    gap: 5
                },
                props.style,
            ]}
            {...props}
        >
            <TextComponent type='label' text="loading" />
            <Image
                source={IMAGES.LOADING}
                style={{ width: 60, height: 60, marginBottom: 16 }}
                resizeMode="contain"
            />
        </View>
    )
}

export default LoadingScreen
