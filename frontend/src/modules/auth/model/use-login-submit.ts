'use client';

import { LoginFormValues } from '@/modules/auth/model/use-login-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '@/modules/auth/api/login';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

export const useLoginSubmit = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const redirectTo = searchParams.get('redirect') || '/';

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: data => {
      toast.success('Вхід успішний', {
        description: 'Ласкаво просимо назад!',
      });

      queryClient.setQueryData(['user'], data.user);
      router.push(redirectTo);
    },
    onError: error => {
      let errorMessage = 'Невірна електронна пошта або пароль';

      if (isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage, {
        description: 'Будь ласка, спробуйте ще раз.',
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return {
    onSubmit,
    isLoading: mutation.isPending,
    error: isAxiosError(mutation.error)
      ? mutation.error.response?.data?.message
      : mutation.error instanceof Error
        ? mutation.error.message
        : 'Невідома помилка',
    isError: mutation.isError,
  };
};
