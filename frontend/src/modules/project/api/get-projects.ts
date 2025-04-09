import { Project } from '@/modules/project/interfaces/project';
import apiClient from '@/config/axios-client';

export const getProjects = async (includeRepositories = false): Promise<Project[]> => {
  const params = { includeRepositories };
  const { data: response } = await apiClient.get<Project[]>('/projects', { params });
  return response;
};
