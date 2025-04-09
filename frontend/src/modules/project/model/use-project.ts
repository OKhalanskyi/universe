'use client';

import { useQuery } from "@tanstack/react-query";
import {getProject} from "@/modules/project/api/get-project";

export const useProject = (id: string, includeRepositories = false, enabled = true) => {
  return useQuery({
    queryKey: ['project', id, { includeRepositories }],
    queryFn: () => getProject(id, includeRepositories),
    enabled,
  });
};
