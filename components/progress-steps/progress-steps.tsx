import type { ProgressStepsProps, ProgressStepsState } from '@/types'
import { Children, cloneElement, useEffect, useState } from 'react'
import { View } from 'react-native'
import RowComponent from '../common/row-component'
import StepIcon from './step-icon'


export default function ProgressSteps({
  children,
  isComplete = false,
  activeStep,
  setActiveStep,
  initialActiveStep = 0,
  ...props
}: ProgressStepsProps) {
  const [stepCount, setStepCount] = useState<ProgressStepsState['stepCount']>(0)

  useEffect(() => {
    setStepCount(Children.count(children))
  }, [children])

  useEffect(() => {
    setActiveStep(initialActiveStep)
  }, [initialActiveStep])

  const handleSetActiveStep = (step: number) => {
    const boundedStep = Math.min(Math.max(step, 0), stepCount - 1)
    setActiveStep(boundedStep)
  }

  return (
    <View style={{ flex: 1 }}>
      <RowComponent>
        {Array.from({ length: stepCount }, (_, index) => (
          <View key={index} style={{ flex: 1 }}>
            <StepIcon
              {...props}
              stepNum={index + 1}
              label={children[index].props.label}
              isFirstStep={index === 0}
              isLastStep={index === stepCount - 1}
              isCompletedStep={isComplete || index < activeStep}
              isActiveStep={!isComplete && index === activeStep}
            />
          </View>
        ))}
      </RowComponent>
      {cloneElement(children[activeStep], {
        setActiveStep: handleSetActiveStep,
        activeStep,
        stepCount,
      })}
    </View>
  )
}