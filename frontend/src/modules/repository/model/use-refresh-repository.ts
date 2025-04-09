'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { refreshRepository } from '@/modules/repository/api/refresh-repository';
import { Repository } from '@/modules/repository/interfaces/repository';
import {AxiosError} from "axios";

export const useRefreshRepository = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => refreshRepository(id),
    onSuccess: async updatedRepository => {
      toast.success('Дані оновлено', {
        description: 'Інформацію про репозиторій успішно оновлено з GitHub',
      });

      queryClient.setQueryData(['repository', id], updatedRepository);

      queryClient.setQueriesData({ queryKey: ['repositories'] }, (oldData: unknown) => {
        if (!oldData) return oldData;

        if (Array.isArray(oldData)) {
          return oldData.map(repo => (repo.id === id ? { ...repo, ...updatedRepository } : repo));
        }

        return oldData;
      });

      queryClient.setQueriesData({ queryKey: ['projects'] }, (oldData: unknown) => {
        if (!oldData) return oldData;

        if (Array.isArray(oldData)) {
          return oldData.map(project => {
            if (!project.repositories) return project;

            return {
              ...project,
              repositories: project.repositories.map((repo: Repository) =>
                repo.id === id ? { ...repo, ...updatedRepository } : repo,
              ),
            };
          });
        }

        return oldData;
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error('Помилка при оновленні даних', {
          description: error.response?.data?.message || 'Спробуйте пізніше',
        });
        return;
      }
    },
  });

  return {
    refreshRepository: () => mutation.mutate(),
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
