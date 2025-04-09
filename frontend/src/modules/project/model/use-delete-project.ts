'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { deleteProject } from '@/modules/project/api/delete-project';
import {AxiosError} from "axios";

export const useDeleteProject = (options?: { redirectTo?: string }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: async () => {
      toast.success('Проєкт видалено', {
        description: 'Проєкт успішно видалено',
      });

      await queryClient.invalidateQueries({ queryKey: ['projects'] });

      if (options?.redirectTo) {
        router.push(options.redirectTo);
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error('Помилка при видаленні проєкту', {
          description: error.response?.data?.message || 'Спробуйте ще раз',
        });
        return;
      }
    },
  });

  return {
    deleteProject: (id: string) => mutation.mutate(id),
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
