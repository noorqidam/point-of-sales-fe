import { createStandaloneToast } from "@chakra-ui/react";
import axios, { AxiosInstance, isAxiosError } from "axios";
import { signOut } from "next-auth/react";

import { baseGeneralToastOptions } from "@/hooks/usePosToast/usePosToast";

const { toast } = createStandaloneToast();

const ApiClient = ({ baseURL }: { baseURL: string }): AxiosInstance => {
  const instance = axios.create({ baseURL });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      // if unauthorized auto logout
      if (401 === error?.response?.status && !toast.isActive("logout-toast")) {
        toast({
          ...baseGeneralToastOptions,
          status: "warning",
          title: "Logout",
          description: "Sesi anda telah berakhir, silahkan login kembali",
          id: "logout-toast",
          onCloseComplete: async () => {
            // Signout from next-auth (clear the session)
            // the redirect to login page is handled in AuthWrapper
            await signOut({ callbackUrl: "/login", redirect: false });
          },
        });

        throw error;
      }

      // skip login error logging
      if (
        isAxiosError(error) &&
        error.response?.status === 400 &&
        error.config?.method === "post" &&
        error.config?.url?.includes("login")
      ) {
        throw error;
      }

      if (isAxiosError(error) && error.response?.status !== 401) {
        // skip cancelled error logging
        if (error.message === "Query was cancelled by React Query") {
          throw error;
        }

        throw error;
      }

      console.error(error);
      throw error;
    }
  );

  return instance;
};

const setClientToken = (instance: AxiosInstance, token: string) => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const apiClient = ApiClient({
  baseURL: process.env.NEXT_PUBLIC_POS_API_URL ?? "",
});

export { apiClient, setClientToken };
