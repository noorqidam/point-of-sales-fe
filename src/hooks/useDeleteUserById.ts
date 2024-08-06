import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { deleteUserById, DeleteUserParameter } from "@/http/deleteUserById";
import { Alert } from "@/types/alert";

export const useDeleteUserById = () => {
  return useMutation<Alert, AxiosError, DeleteUserParameter>({
    mutationFn: deleteUserById,
  });
};
