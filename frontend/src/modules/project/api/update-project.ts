import { Project, UpdateProjectInput } from '@/modules/project/interfaces/project';
import apiClient from '@/config/axios-client';

export const updateProject = async (id: string, data: UpdateProjectInput): Promise<Project> => {
  const { data: response } = await apiClient.patch<Project>(`/projects/${id}`, data);
  return response;
};
