import { apiClient } from "@/http/api-client";
import { Alert, errorAlertResponse, successAlertResponse } from "@/types/alert";
import { Response } from "@/types/Response";
import { Product } from "@/types/product/product";

export type PostProductResponse = Response<Product>;

export interface UpdateProductParameters {
  productName?: string;
  productDescription?: string;
  productImage?: string;
  categoryId?: number;
  stock?: number;
}

export interface PostProductParameters {
  data: UpdateProductParameters;
}

export interface PostProductReturn {
  message: Alert;
  data?: Product;
}

export const postProduct = async (parameters: PostProductParameters) => {
  const data: UpdateProductParameters = {
    ...parameters.data,
  };

  try {
    const result = await apiClient.post<PostProductResponse>(`/product`, data);
    return {
      message: successAlertResponse({
        statusCode: result.status,
        message: result.data.message.text,
      }),
    };
  } catch (error) {
    return {
      message: errorAlertResponse(error as string),
    } as PostProductReturn;
  }
};
