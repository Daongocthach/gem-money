import React, { useMemo } from 'react'
import { Platform, View } from 'react-native'
import { Circle, Defs, LinearGradient, Stop, Svg } from 'react-native-svg'

import { useTheme } from '@/hooks'
import ColumnComponent from './column-component'
import TextComponent from './text-component'

interface CircularProgressRingProps {
  value: number
  size?: number
  strokeWidth?: number
  strokeColor?: string
  unit?: string
  isTask?: boolean
  hideCaption?: boolean
  textColor?: string
}

const CircularProgressRing = ({
  value,
  size = 140,
  strokeWidth = 10,
  strokeColor,
  unit = '%',
  isTask = false,
  hideCaption = false,
  textColor
}: CircularProgressRingProps) => {
  const { colors } = useTheme()
  const center = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(value / 100, 1)
  const strokeDashoffset = circumference * (1 - progress)

  const gradientId = useMemo(() => `grad-${Math.random()}`, [])

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size} height={size} style={{ transform: [{ scaleX: -1 }] }}>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={colors.success} />
            <Stop offset="100%" stopColor={colors.success} />
          </LinearGradient>

        </Defs>

        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={strokeColor ?? colors.ring}
          strokeWidth={strokeWidth}
          fill="none"
        />

        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          originX={center}
          originY={center}
        />
      </Svg>
      <ColumnComponent style={{ position: 'absolute' }} alignItems='center' gap={Platform.OS === 'ios' ? 5 : 0}>
        <TextComponent
          color={textColor || 'onPrimary'}
          fontWeight='semibold'
          textAlign='center'
          size={size * (isTask ? 0.2 : 0.2)}
          text={value + unit}
          style={{
            lineHeight: size * (Platform.OS === 'ios' ? 0.3 : 0.25),
            marginBottom: ((Platform.OS === 'ios' && !isTask) ? -size * 0.1 : undefined)
          }}
        />
        {!hideCaption &&
          <TextComponent
            type="caption"
            size={size * 0.09}
            color={textColor || 'onPrimary'}
            text='total progress'
          />
        }
      </ColumnComponent>
    </View>
  )
}

export default CircularProgressRing
