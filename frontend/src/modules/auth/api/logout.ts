import apiClient from "@/config/axios-client";

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};
