import { useRouter } from "next/router";
import React from "react";

export const useNotifyBrowserUpdates = () => {
  const router = useRouter();

  React.useEffect(() => {
    const handleShowBrowserUpdate = async () => {
      //  need to be imported lazyly as the library only work with window object
      const browserUpdate = (await import("browser-update")).default;

      browserUpdate({
        required: { e: -3, f: -3, o: -3, s: -1, c: -3 },
        unsupported: true,
        api: 2023.03,
        l: "id",
        no_permanent_hide: true,
        notify_esr: true,
        insecure: true,
        test: false, // set to true to test
        text: {
          msg: "Peramban Anda ({brow_name}) sudah <b>kadaluwarsa</b>. <br/>",
          msgmore:
            "Untuk <strong>mengurangi masalah</strong> penggunaan aplikasi dan pengalaman penggunaan yang lebih baik, harap perbarui peramban Anda.",
        },
      });
    };

    router.events.on("routeChangeComplete", handleShowBrowserUpdate);
    router.events.on("hashChangeComplete", handleShowBrowserUpdate);
    return () => {
      router.events.off("routeChangeComplete", handleShowBrowserUpdate);
      router.events.off("hashChangeComplete", handleShowBrowserUpdate);
    };
  }, [router.events]);
};
