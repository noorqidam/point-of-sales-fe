import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { usePosToast } from "@/hooks/usePosToast/usePosToast";
import { useRouter } from "next/router";

export const useLogOut = () => {
  const router = useRouter();
  const { successToast, errorToast } = usePosToast();

  const mutation = useMutation({
    mutationFn: async () => {
      return;
    },
    onError: () => {
      errorToast({
        title: "Logout Gagal",
        description: "Silakan coba lagi",
      });
    },
    onSuccess: async () => {
      successToast({
        title: "Logout Berhasil",
        description: "Anda berhasil keluar dari aplikasi",
        id: "logout-toast",
        duration: 1000,
        onCloseComplete: async () => {
          await signOut({ redirect: false });
          router.push("/login");
        },
      });
    },
  });

  const handleLogoutAndRedirect = () => {
    mutation.mutate();
  };

  const processForceLogout = () => {
    mutation.mutate();
  };

  return {
    handleLogoutAndRedirect,
    processForceLogout,
  };
};
