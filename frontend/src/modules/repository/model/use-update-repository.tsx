'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {UpdateRepositoryInput} from "@/modules/repository/interfaces/repository";
import {updateRepository} from "@/modules/repository/api/update-repository";

export const useUpdateRepository = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateRepositoryInput) => updateRepository(id, data),
    onSuccess: async () => {
      toast.success("Репозиторій оновлено", {
        description: "Дані репозиторію успішно оновлено",
      });

      await queryClient.invalidateQueries({ queryKey: ['repositories'] });
      await queryClient.invalidateQueries({ queryKey: ['repository', id] });
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error: any) => {
      toast.error("Помилка при оновленні репозиторію", {
        description: error.response?.data?.message || "Спробуйте ще раз",
      });
    },
  });

  return {
    updateRepository: (data: UpdateRepositoryInput) => mutation.mutate(data),
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};