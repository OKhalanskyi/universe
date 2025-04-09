'use client';

import { useQuery } from "@tanstack/react-query";
import {getRepositories} from "@/modules/repository/api/get-repositories";

export const useRepositories = (projectId?: string, showUnassigned?: boolean) => {
  return useQuery({
    queryKey: ['repositories', { projectId, showUnassigned }],
    queryFn: () => getRepositories(projectId, showUnassigned),
  });
};
