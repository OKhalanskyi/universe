import { z } from "zod";
import {useForm, useFormContext} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export const loginSchema = z.object({
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
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
  return useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
};

export const useLoginFormContext = () => useFormContext<LoginFormValues>();
