
export type CarouselType = {
    title: string
    img_url: string
}

export type CarouselItemProps = {
    title: string
    status: boolean
    body: string
    body2: string
    imgUrl: string
}

export interface ProgressStepsProps
  extends Omit<StepIconProps, 'stepNum' | 'isFirstStep' | 'isLastStep' | 'isActiveStep' | 'isCompletedStep' | 'label'> {
  isComplete?: boolean
  activeStep: ProgressStepsState['activeStep']
  setActiveStep: (step: ProgressStepsState['activeStep']) => void
  initialActiveStep?: number
  topOffset?: number
  marginBottom?: number
  children: React.ReactElement<ProgressStepProps>[]
}

export interface ProgressStepsState {
  stepCount: number
  activeStep: number
}

export interface ProgressStepProps {
  setActiveStep?: (step: number) => void
  activeStep?: number
  stepCount?: number
  label?: string
  onNext?: () => void
  onPrevious?: () => void
  onSubmit?: () => void
  removeBtnRow?: boolean
  children?: React.ReactNode
  buttonNextText?: string
  buttonPreviousText?: string
  buttonFinishText?: string
  buttonNextDisabled?: boolean
  buttonPreviousDisabled?: boolean
  buttonFinishDisabled?: boolean
  buttonTopOffset?: number
  buttonBottomOffset?: number
  buttonHorizontalOffset?: number
  buttonFillColor?: string
  buttonBorderColor?: string
  buttonNextTextColor?: string
  buttonPreviousTextColor?: string
  buttonFinishTextColor?: string
  buttonDisabledColor?: string
  buttonDisabledTextColor?: string
  hidePreviousButton?: boolean
  hideNextButton?: boolean
  hideFinishButton?: boolean
  loading?: boolean
  disableNextButton?: boolean
  disablePreviousButton?: boolean
  disableFinishButton?: boolean
}

export interface StepIconProps {
  circleSize?: number
  stepNum: number
  isFirstStep: boolean
  isLastStep: boolean
  isActiveStep: boolean
  isCompletedStep: boolean
  label?: string
  borderWidth?: number
  activeStepIconBorderColor?: string
  progressBarColor?: string
  completedProgressBarColor?: string
  activeStepIconColor?: string
  disabledStepIconColor?: string
  completedStepIconColor?: string
  labelColor?: string
  labelFontSize?: number
  activeLabelColor?: string
  activeLabelFontSize?: number
  completedLabelColor?: string
  activeStepNumColor?: string
  completedStepNumColor?: string
  disabledStepNumColor?: string
  completedCheckColor?: string
}