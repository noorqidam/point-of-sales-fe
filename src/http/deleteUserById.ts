import { apiClient } from "@/http/api-client";
import { Alert, errorAlertResponse, successAlertResponse } from "@/types/alert";
import { Response } from "@/types/Response";
import { User } from "@/types/auth/user";

export type DeleteUserResponse = Response<User>;

export interface DeleteUserParameter {
  id: number;
}

export interface DeleteUserReturn {
  message: Alert;
}

export const deleteUserById = async (parameter: DeleteUserParameter) => {
  try {
    const result = await apiClient.delete<DeleteUserResponse>(
      `/users/${parameter.id}`
    );

    return successAlertResponse({
      statusCode: result.status,
      message: result.data.message.text,
    });
  } catch (error) {
    return errorAlertResponse(error as string);
  }
};
