import * as React from "react";
import { QueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

/**
 *  Function for clearing queries from cache when user is in the login page
 *  Assuming that the user is not logged in when he is in the login page
 *  This function is used to prevent the user from querrying data without
 *  being logged in
 */
export const useClearQueriesOnLogin = ({
  queryClient,
}: {
  queryClient: QueryClient;
}) => {
  const router = useRouter();

  // remove queries from cache when user is in the login page
  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url.includes("/login")) {
        queryClient.clear();
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("hashChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("hashChangeComplete", handleRouteChange);
    };
  }, [queryClient, router.events]);
};
