import { apiClient } from "@/http/api-client";
import { Alert, errorAlertResponse, successAlertResponse } from "@/types/alert";
import { Response } from "@/types/Response";
import { ProductCategory } from "@/types/product-category/product_category";

export type PostProductCategoryResponse = Response<ProductCategory>;

export interface UpdateProductCategoryParameters {
  categoryName?: string;
  categoryDescription?: string;
}

export interface PostProductCategoryParameters {
  data: UpdateProductCategoryParameters;
}

export interface PostProductCategoryReturn {
  message: Alert;
  data?: ProductCategory;
}

export const postProductCategory = async (
  parameters: PostProductCategoryParameters
) => {
  const data: UpdateProductCategoryParameters = {
    ...parameters.data,
  };

  try {
    const result = await apiClient.post<PostProductCategoryResponse>(
      `/product-category`,
      data
    );
    return {
      message: successAlertResponse({
        statusCode: result.status,
        message: result.data.message.text,
      }),
      data: result.data.data,
    } as PostProductCategoryReturn;
  } catch (error) {
    return {
      message: errorAlertResponse(error as string),
    } as PostProductCategoryReturn;
  }
};
