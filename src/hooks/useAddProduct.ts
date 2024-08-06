import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  postProduct,
  PostProductParameters,
  PostProductReturn,
} from "@/http/postProduct";

export const useAddProduct = () => {
  return useMutation<PostProductReturn, AxiosError, PostProductParameters>({
    mutationFn: postProduct,
  });
};
