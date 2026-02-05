import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as Crypto from 'expo-crypto'
import { useSQLiteContext } from 'expo-sqlite'
import { Controller, useForm } from 'react-hook-form'

import { showToast } from '@/alerts'
import {
    ButtonComponent,
    ColumnComponent,
    TextComponent,
    TextInputComponent
} from '@/components'
import { IncomesQuery } from '@/database'

type IncomeFormValues = {
  amount: string
  note: string
}

interface AddIncomeFormProps {
  onSuccess?: () => void
}

export default function AddIncomeForm({ onSuccess }: AddIncomeFormProps) {
  const db = useSQLiteContext()
  const queryClient = useQueryClient()

  const { control, handleSubmit, formState: { isValid, errors } } = useForm<IncomeFormValues>({
    defaultValues: {
      amount: '',
      note: '',
    },
  })

  const { mutate: createIncome, isPending } = useMutation({
    mutationFn: async (data: IncomeFormValues) => {
      return await IncomesQuery.create(db, {
        id: Crypto.randomUUID(),
        amount: parseFloat(data.amount),
        note: data.note,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] })
      queryClient.invalidateQueries({ queryKey: ['jars'] })
      
      showToast('add_success')
      onSuccess?.()
    },
    onError: (error) => {
      console.error(error)
    }
  })

  return (
    <ColumnComponent gap={15} style={{ padding: 16 }}>
      <TextComponent text="Thêm thu nhập mới" type="title" textAlign="center" />

      <Controller
        control={control}
        name="amount"
        rules={{ 
          required: 'Vui lòng nhập số tiền',
          validate: v => parseFloat(v) > 0 || 'Số tiền phải lớn hơn 0'
        }}
        render={({ field: { value, onChange } }) => (
          <TextInputComponent
            label="Số tiền"
            placeholder="Ví dụ: 1000000"
            keyboardType="numeric"
            value={value}
            onChangeText={onChange}
            errorMessage={errors.amount?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="note"
        render={({ field: { value, onChange } }) => (
          <TextInputComponent
            label="Ghi chú"
            placeholder="Ví dụ: Lương tháng 2"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <ButtonComponent
        textProps={{ text: 'Lưu thu nhập' }}
        onPress={handleSubmit((data) => createIncome(data))}
        disabled={isPending || !isValid}
        loading={isPending}
      />
    </ColumnComponent>
  )
}