import { FilterParameters } from "@/components/layouts/table/TableContext";
import { apiClient } from "@/http/api-client";
import { initialPagination } from "@/types/pagination";
import { Response } from "@/types/Response";
import { ProductCategory } from "@/types/product-category/product_category";

export type ProductCategoryResponse = Response<Array<ProductCategory>>;

export const getListProductCategoryPagination = async (
  parameters: FilterParameters,
  signal: AbortSignal | undefined
) => {
  const parameters_ = {
    page: parameters.page,
    perPage: parameters.limit,
    name: parameters.search,
  };

  try {
    const result = await apiClient.get<ProductCategoryResponse>(
      `/product-category`,
      {
        params: parameters_,
        signal,
      }
    );

    return result.data;
  } catch {
    return {
      data: [],
      pagination: initialPagination,
    };
  }
};
