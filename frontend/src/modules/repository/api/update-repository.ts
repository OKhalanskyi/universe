import {Repository, UpdateRepositoryInput} from "@/modules/repository/interfaces/repository";
import apiClient from "@/config/axios-client";

export const updateRepository = async (id: string, data: UpdateRepositoryInput): Promise<Repository> => {
  const { data: response } = await apiClient.patch<Repository>(`/repositories/${id}`, data);
  return response;
};
