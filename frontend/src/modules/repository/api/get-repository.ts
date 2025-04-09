import apiClient from '@/config/axios-client';
import { Repository } from '@/modules/repository/interfaces/repository';

export const getRepository = async (id: string): Promise<Repository> => {
  const { data: response } = await apiClient.get<Repository>(`/repositories/${id}`);
  return response;
};
