import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  patchUser,
  PatchUserParameters,
  PatchUserReturn,
} from "@/http/patchUser";

export const useUpdateUser = () => {
  return useMutation<PatchUserReturn, AxiosError, PatchUserParameters>({
    mutationFn: patchUser,
  });
};
