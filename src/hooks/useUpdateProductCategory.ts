import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  patchProductCategory,
  PatchProductCategoryParameters,
  PatchProductCategoryReturn,
} from "@/http/patchProductCategory";

export const useUpdateProductCategory = () => {
  return useMutation<
    PatchProductCategoryReturn,
    AxiosError,
    PatchProductCategoryParameters
  >({
    mutationFn: patchProductCategory,
  });
};
