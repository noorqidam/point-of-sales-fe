import { expandSidebar } from "@/store/main";
import { Box, useMediaQuery } from "@chakra-ui/react";
import { useAtom } from "jotai";
import * as React from "react";
import MenuContents from "@/components/layouts/auth/MenuContents";

export interface SidebarProps {}

const AuthSidebar: React.FC<SidebarProps> = () => {
  const [isExpandSidebar] = useAtom(expandSidebar);

  const [isLessThan768] = useMediaQuery("(max-width: 768px)");

  if (isLessThan768) {
    return null;
  }
  return (
    <Box
      w={isExpandSidebar ? "250px" : "88px"}
      p={4}
      bgColor="GreenPrimary.900"
      overflow="auto"
    >
      <MenuContents />
    </Box>
  );
};

export default AuthSidebar;
