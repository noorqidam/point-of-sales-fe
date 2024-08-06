import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { postUser, PostUserParameters, PostUserReturn } from "@/http/postUser";

export const useAddUser = () => {
  return useMutation<PostUserReturn, AxiosError, PostUserParameters>({
    mutationFn: postUser,
  });
};
