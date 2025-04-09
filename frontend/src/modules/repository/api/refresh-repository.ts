import { Repository } from '@/modules/repository/interfaces/repository';
import apiClient from '@/config/axios-client';

export const refreshRepository = async (id: string): Promise<Repository> => {
  const { data: response } = await apiClient.post<Repository>(`/repositories/${id}/refresh`);
  return response;
};
