import * as Crypto from 'expo-crypto'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
    ButtonComponent,
    ColumnComponent,
    DateTimePicker,
    TextComponent,
    TextInputComponent
} from '@/components'
import { TransactionFormValues } from '@/types'; // Bạn định nghĩa type này tương tự IncomeFormValues
import { useTransactionMutations } from './hooks/use-transaction-mutation'
interface Props {
    jarId: string;
    jarName?: string; // Để hiển thị tên hũ cho người dùng biết họ đang chi ở hũ nào
    onSuccess?: () => void;
}

export default function AddTransactionForm({ jarId, jarName, onSuccess }: Props) {

  const {
    control,
    handleSubmit,
    reset,
    formState: {
      isValid,
      errors
    }
  } = useForm<TransactionFormValues>({
    defaultValues: {
      amount: '',
      note: '',
      date: new Date(),
    },
  })

  const { addTransaction } = useTransactionMutations()

  const handleSave = (data: TransactionFormValues) => {
    addTransaction.mutate({
      id: Crypto.randomUUID(),
      jar_id: jarId,
      amount: parseFloat(data.amount.toString()),
      note: data.note || '',
      date: data.date,
    }, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      }
    });
  }

  return (
    <ColumnComponent gap={15} style={{ padding: 16 }}>
      <ColumnComponent gap={4}>
         <TextComponent text='Add Expense' type="title" textAlign="center" />
         {jarName && (
             <TextComponent 
                text={`Spending from: ${jarName}`} 
                type="caption" 
                textAlign="center" 
                color="primary"
             />
         )}
      </ColumnComponent>

      <Controller
        control={control}
        name="amount"
        rules={{
          required: 'Please enter an amount',
          validate: value => parseFloat(value.toString()) > 0 || 'Amount must be greater than 0'
        }}
        render={({ field: { value, onChange } }) => (
          <TextInputComponent
            label="Amount"
            placeholder="0"
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
            label="Note"
            placeholder="What did you spend on?"
            value={value}
            onChangeText={onChange}
            outline
          >
             <TextInputComponent.RightGroup>
              <TextInputComponent.Clear />
            </TextInputComponent.RightGroup>
          </TextInputComponent>
        )}
      />

      <Controller
        control={control}
        name="date"
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <DateTimePicker
            mode='date'
            label='Date'
            placeholder='Select date'
            dateTime={value}
            setDateTime={onChange}
            hideClear
            errorMessage={errors.date?.message}
          />
        )}
      />

      <ButtonComponent
        textProps={{ text: 'Save Expense' }}
        onPress={handleSubmit(handleSave)}
        disabled={!isValid}
        loading={addTransaction.isPending}
      />
    </ColumnComponent>
  )
}