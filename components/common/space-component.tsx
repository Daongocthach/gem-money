import React from 'react'
import { View, ViewProps } from 'react-native'

interface SpaceComponentProps extends ViewProps {
    width?: number
    height?: number
}

const SpaceComponent = (props: SpaceComponentProps) => {
    const { width, height, style } = props

    return <View style={[{ width, height }, style]} />
}

export default SpaceComponent