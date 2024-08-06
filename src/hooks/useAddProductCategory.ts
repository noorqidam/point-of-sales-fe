import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  postProductCategory,
  PostProductCategoryParameters,
  PostProductCategoryReturn,
} from "@/http/postProductCategory";

export const useAddProductCategory = () => {
  return useMutation<
    PostProductCategoryReturn,
    AxiosError,
    PostProductCategoryParameters
  >({
    mutationFn: postProductCategory,
  });
};
