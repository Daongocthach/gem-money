import { showToast } from '@/alerts';
import { QUERY_KEYS } from '@/constants';
import { JarsQuery } from '@/database'; // Điều chỉnh path của bạn
import { Jar } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';
import { useSQLiteContext } from 'expo-sqlite';

export const useJarMutations = () => {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  // Helper để làm mới danh sách hũ sau mỗi thao tác thành công
  const invalidateJars = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JARS] });
  };

  // 1. Tạo hũ mới
  const createJar = useMutation({
    mutationFn: async (data: Omit<Jar, 'id' | 'current_balance' | 'target_balance' | 'is_active'>) => {
      return await JarsQuery.create(db, {
        ...data,
        id: Crypto.randomUUID(),
      });
    },
    onSuccess: () => {
      invalidateJars();
      showToast('create_success');
    },
  });

  // 2. Cập nhật thông tin hũ (tên, icon, màu, phần trăm)
  const updateJar = useMutation({
    mutationFn: async (jar: Partial<Jar> & { id: string }) => {
      return await JarsQuery.updateJar(db, jar);
    },
    onSuccess: () => {
      invalidateJars();
      showToast('update_success');
    },
  });

  // 3. Xóa hũ (Thường là set is_active = 0)
  const deleteJar = useMutation({
    mutationFn: async (id: string) => {
      return await db.runAsync('UPDATE jars SET is_active = 0 WHERE id = ?', [id]);
    },
    onSuccess: () => {
      invalidateJars();
      showToast('delete_success');
    },
  });

  // 4. Cập nhật mục tiêu tổng (Chia theo phần trăm vào target_balance)
  const updateTargetBalance = useMutation({
    mutationFn: async (totalAmount: number) => {
      return await JarsQuery.updateAllTargetBalances(db, totalAmount);
    },
    onSuccess: () => {
      invalidateJars();
      showToast('update_success');
    },
  });

  return {
    createJar,
    updateJar,
    deleteJar,
    updateTargetBalance,
    // Trạng thái loading tổng hợp nếu cần
    isAnyPending: createJar.isPending || updateJar.isPending || deleteJar.isPending || updateTargetBalance.isPending
  };
};