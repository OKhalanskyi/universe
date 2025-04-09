import {CreateRepositoryInput, Repository} from "@/modules/repository/interfaces/repository";
import apiClient from "@/config/axios-client";

export const createRepository = async (data: CreateRepositoryInput): Promise<Repository> => {
  const { data: response } = await apiClient.post<Repository>('/repositories', data);
  return response;
};
