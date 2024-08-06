import { FilterParameters } from "@/components/layouts/table/TableContext";
import { apiClient } from "@/http/api-client";
import { initialPagination } from "@/types/pagination";
import { Response } from "@/types/Response";
import { User } from "@/types/auth/user";

export type UserResponse = Response<Array<User>>;

export const getListUsersPagination = async (
  parameters: FilterParameters,
  signal: AbortSignal | undefined
) => {
  const parameters_ = {
    page: parameters.page,
    perPage: parameters.limit,
    name: parameters.search,
  };

  try {
    const result = await apiClient.get<UserResponse>(`/users`, {
      params: parameters_,
      signal,
    });

    return result.data;
  } catch {
    return {
      data: [],
      pagination: initialPagination,
    };
  }
};
