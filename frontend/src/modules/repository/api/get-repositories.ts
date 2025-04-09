import apiClient from "@/config/axios-client";
import {Repository} from "@/modules/repository/interfaces/repository";

export const getRepositories = async (projectId?: string, showUnassigned?: boolean): Promise<Repository[]> => {
  const params: Record<string, string | boolean> = {};

  if (projectId) {
    params.projectId = projectId;
  }

  if (showUnassigned) {
    params.unassigned = true;
  }

  const { data: response } = await apiClient.get<Repository[]>('/repositories', { params });
  return response;
};
