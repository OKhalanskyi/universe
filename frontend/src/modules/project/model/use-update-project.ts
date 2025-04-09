'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {UpdateProjectInput} from "@/modules/project/interfaces/project";
import {updateProject} from "@/modules/project/api/update-project";

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateProjectInput) => updateProject(id, data),
    onSuccess: async () => {
      toast.success("Проєкт оновлено", {
        description: "Дані проєкту успішно оновлено",
      });

      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      await queryClient.invalidateQueries({ queryKey: ['project', id] });
    },
    onError: (error: any) => {
      toast.error("Помилка при оновленні проєкту", {
        description: error.response?.data?.message || "Спробуйте ще раз",
      });
    },
  });

  return {
    updateProject: (data: UpdateProjectInput) => mutation.mutate(data),
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};