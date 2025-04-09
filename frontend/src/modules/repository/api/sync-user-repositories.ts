import apiClient from "@/config/axios-client";
import {Repository} from "@/modules/repository/interfaces/repository";

export const syncUserRepositories = async (): Promise<Repository[]> => {
  const { data: response } = await apiClient.post<Repository[]>('/repositories/sync');
  return response;
};
