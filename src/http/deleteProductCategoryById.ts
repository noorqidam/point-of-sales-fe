import { apiClient } from "@/http/api-client";
import { Alert, errorAlertResponse, successAlertResponse } from "@/types/alert";
import { Response } from "@/types/Response";
import { ProductCategory } from "@/types/product-category/product_category";

export type DeleteProductCategoryResponse = Response<ProductCategory>;

export interface DeleteProductCategoryParameter {
  id: number;
}

export interface DeleteProductCategoryReturn {
  message: Alert;
}

export const deleteProductCategoryById = async (
  parameter: DeleteProductCategoryParameter
) => {
  try {
    const result = await apiClient.delete<DeleteProductCategoryResponse>(
      `/product-category/${parameter.id}`
    );

    return successAlertResponse({
      statusCode: result.status,
      message: result.data.message.text,
    });
  } catch (error) {
    return errorAlertResponse(error as string);
  }
};
