import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'

import { showToast } from '@/alerts'
import {
  ButtonComponent,
  ColumnComponent,
  InlineDropdown,
  TextComponent,
  TextInputComponent
} from '@/components'
import { TransactionsQuery } from '@/database/transaction.query'
import { Jar } from '@/types'
import * as Crypto from 'expo-crypto'
import { useSQLiteContext } from 'expo-sqlite'

type TransactionFormValues = {
  jar_id: string
  target_jar_id?: string
  amount: string
  note: string
  date: Date
  type: 'EXPENSE' | 'INCOME' | 'TRANSFER'
}

// Thêm interface cho Props
interface AddTransactionFormProps {
  jars: Jar[];
  onSuccess?: () => void;
}

export default function AddTransactionForm({ jars, onSuccess }: AddTransactionFormProps) {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  // Chuyển đổi dữ liệu jars sang format của InlineDropdown
  const jarOptions = jars.map(j => ({ label: j.name, value: j.id }));

  const transactionTypeOptions = [
    { label: 'Chi tiêu (Expense)', value: 'EXPENSE' },
    { label: 'Thu nhập (Income)', value: 'INCOME' },
    { label: 'Chuyển khoản (Transfer)', value: 'TRANSFER' },
  ];

  const { control, handleSubmit, watch, formState: { isValid, errors } } = useForm<TransactionFormValues>({
    defaultValues: {
      type: 'EXPENSE',
      date: new Date(),
      amount: '',
      note: '',
    },
  });

  const selectedType = watch('type');

  const { mutate: saveTransaction, isPending } = useMutation({
    mutationFn: async (data: TransactionFormValues) => {
      return await TransactionsQuery.create(db, {
        id: Crypto.randomUUID(),
        jar_id: data.jar_id,
        target_jar_id: data.target_jar_id,
        amount: parseFloat(data.amount),
        note: data.note,
        type: data.type,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jars'] });
      showToast('add_success');
      onSuccess?.(); // Gọi hàm đóng sheet từ cha
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const onSubmit = (data: TransactionFormValues) => saveTransaction(data);

  return (
    <ColumnComponent gap={15} style={{ padding: 16 }}>
       <TextComponent text="Thêm giao dịch mới" type="title" textAlign="center" />
       
       <Controller
        control={control}
        name="type"
        render={({ field: { value, onChange } }) => (
          <InlineDropdown
            label="Loại giao dịch"
            selected={value}
            setSelected={onChange}
            selects={transactionTypeOptions}
            hideFooter
          />
        )}
      />

      <Controller
        control={control}
        name="jar_id"
        rules={{ required: 'Vui lòng chọn hũ' }}
        render={({ field: { value, onChange } }) => (
          <InlineDropdown
            label={selectedType === 'TRANSFER' ? "Từ hũ" : "Chọn hũ"}
            selected={value}
            setSelected={onChange}
            selects={jarOptions}
            placeholder='Chọn hũ'
            hideFooter
            errorMessage={errors.jar_id?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="amount"
        rules={{ required: 'Vui lòng nhập số tiền' }}
        render={({ field: { value, onChange } }) => (
          <TextInputComponent
            label="Số tiền"
            placeholder="0"
            keyboardType="numeric"
            value={value}
            onChangeText={onChange}
            errorMessage={errors.amount?.message}
          />
        )}
      />

      <ButtonComponent
        textProps={{ text: 'Lưu giao dịch' }}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending || !isValid}
        loading={isPending}
      />
    </ColumnComponent>
  );
}