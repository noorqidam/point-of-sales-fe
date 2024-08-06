import { apiClient } from "@/http/api-client";
import { Alert, errorAlertResponse, successAlertResponse } from "@/types/alert";
import { Response } from "@/types/Response";
import { ProductCategory } from "@/types/product-category/product_category";

export type PatchProductCategoryResponse = Response<ProductCategory>;

export interface UpdateProductCategoryParameters {
  id?: number;
  categoryName?: string;
  categoryDescription?: string;
}

export interface PatchProductCategoryParameters {
  data: UpdateProductCategoryParameters;
}

export interface PatchProductCategoryReturn {
  message: Alert;
  data?: ProductCategory;
}

export const patchProductCategory = async (
  parameters: PatchProductCategoryParameters
): Promise<PatchProductCategoryReturn> => {
  const data: UpdateProductCategoryParameters = { ...parameters.data };

  try {
    const result = await apiClient.patch<PatchProductCategoryResponse>(
      `/product-category/${parameters.data.id}`,
      data
    );

    if (result.status === 200 || result.status === 201) {
      return {
        message: successAlertResponse({
          statusCode: result.status,
          message: result.data.message.text,
        }),
        data: result.data.data,
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
