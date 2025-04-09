import apiClient from "@/config/axios-client";

export const deleteRepository = async (id: string): Promise<void> => {
  await apiClient.delete(`/repositories/${id}`);
};
