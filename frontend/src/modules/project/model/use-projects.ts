'use client';

import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/modules/project/api/get-projects';

export const useProjects = (includeRepositories = false) => {
  return useQuery({
    queryKey: ['projects', { includeRepositories }],
    queryFn: () => getProjects(includeRepositories),
  });
};
