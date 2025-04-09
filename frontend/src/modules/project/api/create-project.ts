import { CreateProjectInput, Project } from '@/modules/project/interfaces/project';
import apiClient from '@/config/axios-client';

export const createProject = async (data: CreateProjectInput): Promise<Project> => {
  const { data: response } = await apiClient.post<Project>('/projects', data);
  return response;
};
