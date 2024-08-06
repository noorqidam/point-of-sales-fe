import { apiClient } from "@/http/api-client";
import { Alert, errorAlertResponse, successAlertResponse } from "@/types/alert";
import { Response } from "@/types/Response";
import { Product } from "@/types/product/product";

export type DeleteProductResponse = Response<Product>;

export interface DeleteProductParameter {
  id: number;
}

export interface DeleteProductReturn {
  message: Alert;
}

export const deleteProductById = async (parameter: DeleteProductParameter) => {
  try {
    const result = await apiClient.delete<DeleteProductResponse>(
      `/product/${parameter.id}`
    );

    return successAlertResponse({
      statusCode: result.status,
      message: result.data.message.text,
    });
  } catch (error) {
    return errorAlertResponse(error as string);
  }
};
