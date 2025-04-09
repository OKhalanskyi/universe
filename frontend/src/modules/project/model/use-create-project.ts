'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createProject } from '@/modules/project/api/create-project';
import { CreateProjectInput } from '@/modules/project/interfaces/project';
import {AxiosError} from "axios";

export const useCreateProject = (options?: { redirectTo?: string }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: async data => {
      toast.success('Проєкт створено', {
        description: 'Новий проєкт успішно додано',
      });

      await queryClient.invalidateQueries({ queryKey: ['projects'] });

      if (options?.redirectTo) {
        router.push(options.redirectTo.replace(':id', data.id));
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error('Помилка при створенні проєкту', {
          description: error.response?.data?.message || 'Перевірте правильність даних',
        });
      }
    },
  });

  return {
    createProject: (data: CreateProjectInput) => mutation.mutate(data),
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
