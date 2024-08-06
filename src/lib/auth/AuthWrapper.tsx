import * as React from "react";
import { Box, Spinner } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { apiClient, setClientToken } from "@/http/api-client";

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: sessionData, status } = useSession();

  if (status === "loading") {
    return (
      <Box w="100" h="100" display="grid" placeItems="center">
        <Spinner />
      </Box>
    );
  }

  if (status === "authenticated") {
    setClientToken(apiClient, sessionData.accessToken ?? "");
  }
  return <>{children}</>;
};

export default AuthWrapper;
