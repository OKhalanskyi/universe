'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createRepository } from '@/modules/repository/api/create-repository';
import { CreateRepositoryInput } from '@/modules/repository/interfaces/repository';
import {AxiosError} from "axios";

export const useCreateRepository = (options?: { redirectTo?: string }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: createRepository,
    onSuccess: async () => {
      toast.success('Репозиторій додано', {
        description: 'Репозиторій успішно додано до вашого CRM',
      });

      await queryClient.invalidateQueries({ queryKey: ['repositories'] });
      await queryClient.invalidateQueries({ queryKey: ['projects'] });

      if (options?.redirectTo) {
        router.push(options.redirectTo);
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error('Помилка при додаванні репозиторію', {
          description: error.response?.data?.message || 'Перевірте правильність даних',
        });
        return;
      }
    },
  });

  return {
    createRepository: (data: CreateRepositoryInput) => mutation.mutate(data),
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
