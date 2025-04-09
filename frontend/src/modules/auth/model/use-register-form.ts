import { z } from "zod";
import {useForm, useFormContext} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export const registerSchema = z.object({
  name: z.string().optional(),
  email: z
  .string({
    required_error: "Електронна пошта обов'язкова",
  })
  .email({
    message: "Введіть коректну електронну пошту",
  }),
  password: z
  .string({
    required_error: "Пароль обов'язковий",
  })
  .min(6, {
    message: "Пароль має містити не менше 6 символів",
  }),
  confirmPassword: z
  .string({
    required_error: "Підтвердження паролю обов'язкове",
  })
  .min(6, {
    message: "Пароль має містити не менше 6 символів",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Паролі не співпадають",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const useRegisterForm = () => {
  return useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
};

export const useRegisterFormContext = () => useFormContext<RegisterFormValues>();
