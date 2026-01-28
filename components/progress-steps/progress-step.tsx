import ButtonComponent from '@/components/common/button-component'
import KeyboardAwareWrapper from '@/components/common/keyboard-aware-wrapper'
import RowComponent from '@/components/common/row-component'
import { ProgressStepProps } from '@/types'

export default function ProgressStep({
  removeBtnRow = false,
  activeStep = 0,
  stepCount = 0,
  buttonNextDisabled = false,
  buttonPreviousDisabled = false,
  buttonBottomOffset = 10,
  buttonTopOffset = 12,
  buttonHorizontalOffset = 0,
  hidePreviousButton = false,
  hideNextButton = false,
  hideFinishButton = false,
  loading = false,
  onNext,
  onPrevious,
  onSubmit,
  setActiveStep,
  ...props
}: ProgressStepProps) {

  const onNextStep = () => {
    onNext?.()
  }

  const onPreviousStep = () => {
    onPrevious?.()
  }

  return (
    <KeyboardAwareWrapper>
      {props.children}
      {!removeBtnRow && (
        <RowComponent gap={10}>
          {!hidePreviousButton && (
            <ButtonComponent
              onPress={onPreviousStep}
              textProps={{ text: 'previous' }}
              disabled={buttonPreviousDisabled}
              loading={loading}
              style={{ flex: 1 }}
            />
          )}
          {(activeStep === stepCount - 1 && !hideFinishButton) ? (
            <ButtonComponent
              onPress={onSubmit}
              textProps={{ text: 'submit' }}
              disabled={buttonNextDisabled}
              loading={loading}
              style={{ flex: 1 }}
            />
          ) : (hideNextButton ? null : (
            <ButtonComponent
              onPress={onNextStep}
              textProps={{ text: 'next' }}
              disabled={buttonNextDisabled}
              loading={loading}
              style={{ flex: 1 }}
            />
          ))}
        </RowComponent>
      )}
    </KeyboardAwareWrapper>
  )
}