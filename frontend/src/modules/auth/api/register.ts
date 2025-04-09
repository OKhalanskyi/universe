import apiClient from '@/config/axios-client';
import { RegisterFormValues } from '@/modules/auth/model/use-register-form';

interface RegisterResponse {
  success: boolean;
  message?: string;
}

export const register = async (
  credentials: Omit<RegisterFormValues, 'confirmPassword'>,
): Promise<RegisterResponse> => {
  const { data } = await apiClient.post<RegisterResponse>('/auth/register', credentials);

  return data;
};
