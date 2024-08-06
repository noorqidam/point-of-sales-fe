import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  deleteProductCategoryById,
  DeleteProductCategoryParameter,
} from "@/http/deleteProductCategoryById";
import { Alert } from "@/types/alert";

export const useDeleteProductCategoryById = () => {
  return useMutation<Alert, AxiosError, DeleteProductCategoryParameter>({
    mutationFn: deleteProductCategoryById,
  });
};
