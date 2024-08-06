import { apiClient } from "@/http/api-client";
import { Alert, errorAlertResponse, successAlertResponse } from "@/types/alert";
import { Response } from "@/types/Response";
import { User } from "@/types/auth/user";

export type PatchUserResponse = Response<User>;

export interface UpdateUserParameters {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  gender?: string;
  password?: string;
}

export interface PatchUserParameters {
  data: UpdateUserParameters;
}

export interface PatchUserReturn {
  message: Alert;
  user?: User;
}

export const patchUser = async (
  parameters: PatchUserParameters
): Promise<PatchUserReturn> => {
  const data: UpdateUserParameters = { ...parameters.data };

  try {
    const result = await apiClient.patch<PatchUserResponse>(
      `/users/${parameters.data.id}`,
      data
    );

    if (result.status === 200 || result.status === 201) {
      return {
        message: successAlertResponse({
          statusCode: result.status,
          message: result.data.message.text,
        }),
        user: result.data.data,
      };
    } else {
      return {
        message: errorAlertResponse("Unexpected status code"),
      };
    }
  } catch (error: any) {
    return {
      message: errorAlertResponse(
        error?.response?.data?.message || "Gagal memproses permintaan"
      ),
    };
  }
};
