import { FilterParameters } from "@/components/layouts/table/TableContext";
import { apiClient } from "@/http/api-client";
import { initialPagination } from "@/types/pagination";
import { Response } from "@/types/Response";
import { Product } from "@/types/product/product";

export type ProductResponse = Response<Array<Product>>;

export const getListProductPagination = async (
  parameters: FilterParameters,
  signal: AbortSignal | undefined
) => {
  const parameters_ = {
    page: parameters.page,
    perPage: parameters.limit,
    productName: parameters.search,
  };

  try {
    const result = await apiClient.get<ProductResponse>(`/product`, {
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
