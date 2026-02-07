import { Controller, useForm } from 'react-hook-form'

import {
  ButtonComponent,
  ColumnComponent,
  DateTimePicker,
  TextComponent,
  TextInputComponent
} from '@/components'
import { IncomeFormValues } from '@/types'
import { useTranslation } from 'react-i18next'
import { useIncomeMutation } from './hooks/use-income-mutation'


export default function AddIncomeForm() {
  const { t } = useTranslation()

  const {
    control,
    handleSubmit,
    reset,
    formState: {
      isValid,
      errors
    }
  } = useForm<IncomeFormValues>({
    defaultValues: {
      amount: '',
      note: '',
      date: new Date(),
    },
  })

  const {
    createIncome,
    isCreating
  } = useIncomeMutation({ reset })

  return (
    <ColumnComponent gap={15} style={{ padding: 16 }}>
      <TextComponent text='add_new_income' type="title" textAlign="center" />

      <Controller
        control={control}
        name="amount"
        rules={{
          required: 'please enter an amount',
          validate: value => parseFloat(value) > 0 || 'amount must be greater than 0'
        }}
        render={({ field: { value, onChange } }) => (
          <TextInputComponent
            label="amount"
            placeholder="ex: 1000000"
            keyboardType="numeric"
            value={value}
            onChangeText={onChange}
            errorMessage={errors.amount?.message}
            outline
            isCurrency
            suffix='đ'
          >
            <TextInputComponent.RightGroup>
              <TextInputComponent.Clear />
            </TextInputComponent.RightGroup>
          </TextInputComponent>
        )}
      />

      <Controller
        control={control}
        name="note"
        render={({ field: { value, onChange } }) => (
          <TextInputComponent
            label="note"
            placeholder={t('ex') + ': Lương tháng '+ new Date().getMonth()}
            value={value}
            onChangeText={onChange}
            outline
          />
        )}
      />

      <Controller
        control={control}
        name="date"
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <DateTimePicker
            mode='date'
            label='date'
            placeholder='select_date'
            dateTime={value}
            setDateTime={onChange}
            hideClear
            errorMessage={errors.date?.message}
          />
        )}
      />

      <ButtonComponent
        textProps={{ text: 'save_income' }}
        onPress={handleSubmit((data) => createIncome(data))}
        disabled={!isValid}
        loading={isCreating}
      />
    </ColumnComponent>
  )
}