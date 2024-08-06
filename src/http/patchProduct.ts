import { apiClient } from "@/http/api-client";
import { Alert, errorAlertResponse, successAlertResponse } from "@/types/alert";
import { Response } from "@/types/Response";
import { Product } from "@/types/product/product";

export type PatchProductResponse = Response<Product>;

export interface UpdateProductParameters {
  id?: number;
  productName?: string;
  productDescription?: string;
  productImage?: string;
  categoryId?: number;
  stock?: number;
}

export interface PatchProductParameters {
  data: UpdateProductParameters;
}

export interface PatchProductReturn {
  message: Alert;
  data?: Product;
}

export const patchProduct = async (
  parameters: PatchProductParameters
): Promise<PatchProductReturn> => {
  const data: UpdateProductParameters = { ...parameters.data };

  try {
    const result = await apiClient.patch<PatchProductResponse>(
      `/product/${parameters.data.id}`,
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
