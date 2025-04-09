import {LoginFormValues} from "@/modules/auth/model/use-login-form";
import apiClient from "@/config/axios-client";
import {User} from "@/modules/auth/interfaces/user";

interface LoginResponse {
  success: boolean;
  user: User;
  message?: string;
}

export const login = async (credentials: LoginFormValues): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);

  return data;
};
