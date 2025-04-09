'use client';

import { useQuery } from '@tanstack/react-query';
import { getRepository } from '@/modules/repository/api/get-repository';

export const useRepository = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['repository', id],
    queryFn: () => getRepository(id),
    enabled,
  });
};
