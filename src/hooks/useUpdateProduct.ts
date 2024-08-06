import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  patchProduct,
  PatchProductParameters,
  PatchProductReturn,
} from "@/http/patchProduct";

export const useUpdateProduct = () => {
  return useMutation<PatchProductReturn, AxiosError, PatchProductParameters>({
    mutationFn: patchProduct,
  });
};
