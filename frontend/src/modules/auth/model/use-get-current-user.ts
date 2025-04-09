import {useQuery, useQueryClient} from "@tanstack/react-query";
import {User} from "@/modules/auth/interfaces/user";
import {getCurrentUser} from "@/modules/auth/api/get-current-user";

export const useCurrentUser = () => {
  const queryClient = useQueryClient();

  return useQuery<User>({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });
};