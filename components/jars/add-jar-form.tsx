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
import { JarsQuery } from '@/database'

type JarFormValues = {
  name: string
  percentage: string
  color: string
}

interface AddJarFormProps {
  onSuccess?: () => void
}

export default function AddJarForm({ onSuccess }: AddJarFormProps) {
  const db = useSQLiteContext()
  const queryClient = useQueryClient()

  const { control, handleSubmit, formState: { isValid, errors } } = useForm<JarFormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      percentage: '',
      color: '#4CAF50',
    },
  })

  const { mutate: createJar, isPending } = useMutation({
    mutationFn: async (data: JarFormValues) => {
      return await JarsQuery.create(db, {
        id: Crypto.randomUUID(),
        name: data.name,
        percentage: parseFloat(data.percentage),
        color: data.color,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jars'] })
      showToast('add_success')
      onSuccess?.()
    },
    onError: (error) => console.error(error)
  })

  return (
    <ColumnComponent gap={15} style={{ padding: 16 }}>
      <TextComponent text="Thêm hũ mới" type="title" textAlign="center" />

      {/* Tên hũ */}
      <Controller
        control={control}
        name="name"
        rules={{ required: 'Tên hũ không được để trống' }}
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInputComponent
            errorMessage={errors.name?.message}
            mode="outlined"
          >
            <TextInputComponent.Field
              placeholder="Ví dụ: Tiền tiết kiệm"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
            <TextInputComponent.RightGroup>
              <TextInputComponent.Clear onClear={() => onChange('')} />
            </TextInputComponent.RightGroup>
          </TextInputComponent>
        )}
      />

      {/* Phần trăm (%) */}
      <Controller
        control={control}
        name="percentage"
        rules={{ 
          required: 'Vui lòng nhập phần trăm',
          validate: v => (parseFloat(v) >= 0 && parseFloat(v) <= 100) || 'Phần trăm từ 0 - 100' 
        }}
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInputComponent
            errorMessage={errors.percentage?.message}
            mode="outlined"
          >
            <TextInputComponent.Field
              placeholder="0"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
            <TextInputComponent.RightGroup>
              <TextComponent text="%" color="icon" style={{ marginRight: 8 }} />
              <TextInputComponent.Clear onClear={() => onChange('')} />
            </TextInputComponent.RightGroup>
          </TextInputComponent>
        )}
      />

      <ButtonComponent
        textProps={{ text: 'Tạo hũ' }}
        onPress={handleSubmit((data) => createJar(data))}
        disabled={isPending || !isValid}
        loading={isPending}
      />
    </ColumnComponent>
  )
}