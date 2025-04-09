import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {RegisterFormValues} from "@/modules/auth/model/use-register-form";
import {register} from "@/modules/auth/api/register";
import {toast} from "sonner";
import {isAxiosError} from "axios";

export const useRegisterSubmit = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: RegisterFormValues) => {
      const { confirmPassword, ...registerData } = data;
      return register(registerData);
    },
    onSuccess: (data) => {
      toast.success("Реєстрація успішна", {
        description: "Ласкаво просимо до нашої платформи!",
      });

      router.push("/login");
    },
    onError: (error) => {
      let errorMessage = "Не вдалося створити обліковий запис. Спробуйте ще раз.";

      if (isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage, {
        description: "Будь ласка, спробуйте ще раз.",
      });
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  return {
    onSubmit,
    isLoading: mutation.isPending,
    error: isAxiosError(mutation.error)
      ? mutation.error.response?.data?.message
      : mutation.error instanceof Error
        ? mutation.error.message
        : "Невідома помилка",
    isError: mutation.isError,
  };
};