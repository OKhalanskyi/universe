'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {deleteRepository} from "@/modules/repository/api/delete-repository";

export const useDeleteRepository = (options?: { redirectTo?: string }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: deleteRepository,
    onSuccess: async () => {
      toast.success("Репозиторій видалено", {
        description: "Репозиторій успішно видалено з вашого CRM",
      });

      await queryClient.invalidateQueries({ queryKey: ['repositories'] });

      await queryClient.invalidateQueries({ queryKey: ['projects'] });

      if (options?.redirectTo) {
        router.push(options.redirectTo);
      }
    },
    onError: (error: any) => {
      toast.error("Помилка при видаленні репозиторію", {
        description: error.response?.data?.message || "Спробуйте ще раз",
      });
    },
  });

  return {
    deleteRepository: (id: string) => mutation.mutate(id),
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
