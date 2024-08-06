import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  deleteProductById,
  DeleteProductParameter,
} from "@/http/deleteProductById";
import { Alert } from "@/types/alert";

export const useDeleteProductById = () => {
  return useMutation<Alert, AxiosError, DeleteProductParameter>({
    mutationFn: deleteProductById,
  });
};
