import { Check } from 'lucide-react-native'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Dimensions, View } from 'react-native'

import ColumnComponent from '@/components/common/column-component'
import RowComponent from '@/components/common/row-component'
import TextComponent from '@/components/common/text-component'

import { useTheme } from '@/hooks/use-theme'
import { StepIconProps } from '@/types'

const CIRCLE_SIZE = 35
const MOBILE_BREAKPOINT = 768
const MOBILE_LINE_POSITION = 78
const DESKTOP_LINE_POSITION = 58

export default function StepIcon(props: StepIconProps) {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const {
    isActiveStep,
    isCompletedStep,
    isFirstStep,
    isLastStep,
    stepNum,
    label,
    activeLabelFontSize,
    borderWidth = 2,
    activeStepIconBorderColor = colors.primary,
    progressBarColor = colors.cardDisabled,
    completedProgressBarColor = colors.primary,
    activeStepIconColor = 'transparent',
    completedStepIconColor = colors.primary,
    disabledStepIconColor = colors.cardDisabled,
    labelColor = colors.onCardDisabled,
    activeLabelColor = colors.primary,
    completedLabelColor = colors.primary,
    activeStepNumColor = colors.primary,
    completedStepNumColor = colors.primary,
    disabledStepNumColor = colors.onCardDisabled,
    completedCheckColor = colors.onPrimary,
    labelFontSize = 12,
    circleSize = CIRCLE_SIZE,
  } = props

  const lineAnimationValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isCompletedStep || isActiveStep) {
      Animated.spring(lineAnimationValue, {
        toValue: 1,
        useNativeDriver: false,
        tension: 25,
        friction: 25,
      }).start()
    } else {
      lineAnimationValue.setValue(0)
    }
  }, [isCompletedStep, isActiveStep])

  const getLinePosition = () => {
    const screenWidth = Dimensions.get('window').width
    const isMobileWidth = screenWidth <= MOBILE_BREAKPOINT
    return isMobileWidth ? MOBILE_LINE_POSITION : DESKTOP_LINE_POSITION
  }

  const getLineColor = (isLeftLine: boolean) => {
    if (isLeftLine && (isCompletedStep || isActiveStep)) {
      return completedProgressBarColor
    }

    if (!isLeftLine && isCompletedStep) {
      return completedProgressBarColor
    }

    return progressBarColor
  }

  const getStepColor = () => {
    if (isActiveStep) return activeStepIconColor
    if (isCompletedStep) return completedStepIconColor
    return disabledStepIconColor
  }

  const getLabelColor = () => {
    if (isActiveStep) return activeLabelColor
    if (isCompletedStep) return completedLabelColor
    return labelColor
  }

  const getNumberColor = () => {
    if (isActiveStep) return activeStepNumColor
    if (isCompletedStep) return completedStepNumColor
    return disabledStepNumColor
  }

  const linePosition = getLinePosition()

  const renderLine = (isLeft: boolean) => (
    <View
      style={{
        zIndex: 1,
        position: 'absolute',
        ...(isLeft ? { left: 0, right: `${linePosition}%` } : { left: `${linePosition}%`, right: 0 }),
        height: borderWidth,
        backgroundColor: progressBarColor,
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '100%',
          backgroundColor: getLineColor(isLeft),
          width: lineAnimationValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        }}
      />
    </View>
  )

  return (
    <ColumnComponent gap={6}>
      <RowComponent style={{ position: 'relative', width: '100%' }} justify='center'>
        {!isFirstStep && renderLine(true)}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            backgroundColor: getStepColor(),
            ...(isActiveStep && {
              borderColor: activeStepIconBorderColor,
              borderWidth: 3,
            }),
          }}
        >
          {isCompletedStep ? (
            <Check size={18} color={completedCheckColor} />
          ) : (
            <TextComponent
              style={{
                color: getNumberColor(),
                marginTop: 2,
              }}
              type='label'
            >
              {stepNum}
            </TextComponent>
          )}
        </View>
        {!isLastStep && renderLine(false)}
      </RowComponent>
      <TextComponent
        style={[
          {
            height: 40,
            color: getLabelColor(),
            fontSize: isActiveStep ? activeLabelFontSize || labelFontSize : labelFontSize,
          },
        ]}
        type='label'
        numberOfLines={2}
        textAlign='center'
      >
        {t(label ?? '')}
      </TextComponent>
    </ColumnComponent>
  )
}