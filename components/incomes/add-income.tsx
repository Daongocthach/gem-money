import {
  ButtonComponent,
  ColumnComponent,
  DateTimePicker,
  TextComponent,
  TextInputComponent
} from '@/components'
import { IncomeFormValues } from '@/types'
import { Controller, useForm } from 'react-hook-form'
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
    mode: 'onChange', // Giúp isValid cập nhật ngay lập tức
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

      {/* Amount Input */}
      <Controller
        control={control}
        name="amount"
        rules={{
          required: 'please enter an amount',
          validate: value => parseFloat(value) > 0 || 'amount must be greater than 0'
        }}
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInputComponent
            errorMessage={errors.amount?.message}
            mode="outlined"
          >
            {/* Sử dụng .Field để nhận các props từ Controller */}
            <TextInputComponent.Field
              placeholder="ex: 1000000"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
            <TextInputComponent.RightGroup>
              <TextComponent text="đ" color="icon" style={{ marginRight: 8 }} />
              <TextInputComponent.Clear onClear={() => onChange('')} />
            </TextInputComponent.RightGroup>
          </TextInputComponent>
        )}
      />

      {/* Note Input */}
      <Controller
        control={control}
        name="note"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInputComponent mode="outlined">
            <TextInputComponent.Field
              placeholder={`${t('ex')}: Lương tháng ${new Date().getMonth() + 1}`}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          </TextInputComponent>
        )}
      />

      {/* Date Picker */}
      <Controller
        control={control}
        name="date"
        rules={{ required: 'date is required' }}
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