import apiClient from '@/config/axios-client';
import { User } from '@/modules/auth/interfaces/user';

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
};
