'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { logout } from '@/modules/auth/api/logout';
import {AxiosError} from "axios";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();

      router.push('/login');

      toast.success('Вихід виконано успішно', {
        description: 'Ви вийшли з системи',
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error('Помилка при виході з системи', {
          description: error.response?.data?.message || 'Спробуйте ще раз',
        });
        return;
      }
    },
  });

  return {
    logout: () => mutation.mutate(),
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
