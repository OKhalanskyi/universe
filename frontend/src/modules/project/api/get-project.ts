import { Project } from '@/modules/project/interfaces/project';
import apiClient from '@/config/axios-client';

export const getProject = async (id: string, includeRepositories = false): Promise<Project> => {
  const params = { includeRepositories };
  const { data: response } = await apiClient.get<Project>(`/projects/${id}`, { params });
  return response;
};
