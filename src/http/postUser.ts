import { apiClient } from "@/http/api-client";

import { Alert, errorAlertResponse, successAlertResponse } from "@/types/alert";
import { Response } from "@/types/Response";
import { User } from "@/types/auth/user";

export type PostUserResponse = Response<User>;

export interface UpdateUserParameters {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  gender?: string;
  password?: string;
}

export interface PostUserParameters {
  data: UpdateUserParameters;
}

export interface PostUserReturn {
  message: Alert;
  user?: User;
}

export const postUser = async (parameters: PostUserParameters) => {
  const data: UpdateUserParameters = {
    ...parameters.data,
  };

  try {
    const result = await apiClient.post<PostUserResponse>(`/users`, data);
    return {
      message: successAlertResponse({
        statusCode: result.status,
        message: result.data.message.text,
      }),
      data: result.data.data,
    } as PostUserReturn;
  } catch (error) {
    return {
      message: errorAlertResponse(error as string),
    } as PostUserReturn;
  }
};
