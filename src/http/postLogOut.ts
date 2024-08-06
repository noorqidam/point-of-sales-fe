import { apiClient } from "@/http/api-client";

import { Response } from "@/types/Response";

export type APIResponse = Response<LogOut>;

export interface LogOut {
  type?: string;
  text: string;
}

export const postLogOut = async () => {
  const result = await apiClient.post<APIResponse>(`/api/auth/logout`);
  return result.data.data.text;
};
