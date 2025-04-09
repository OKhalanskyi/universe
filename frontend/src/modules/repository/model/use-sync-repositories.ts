'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { syncUserRepositories } from '@/modules/repository/api/sync-user-repositories';

export const useSyncRepositories = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: syncUserRepositories,
    onSuccess: data => {
      toast.success(`Синхронізовано ${data.length} репозиторіїв`, {
        description: 'Ваші GitHub репозиторії успішно синхронізовано',
      });

      queryClient.invalidateQueries({ queryKey: ['repositories'] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error('Помилка при синхронізації', {
          description: error.message || 'Перевірте GitHub доступ',
        });
        return;
      }
    },
  });

  return {
    syncRepositories: () => mutation.mutate(),
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
