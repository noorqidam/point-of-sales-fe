import * as React from "react";
import { expandSidebar } from "@/store/main";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { Flex, Text } from "@chakra-ui/react";
import { listMenu, Menu } from "@/types/auth/menus";
import NextLink from "next/link";

export interface MenuContentsProps {}

const MenuContents = () => {
  const [isExpandSidebar] = useAtom(expandSidebar);
  const router = useRouter();

  return (
    <Flex flexDirection="column" alignItems="center" gap={4}>
      {listMenu.map((menu: Menu) => {
        const path = `/${menu.pages}`;
        const isActive = router.pathname.startsWith(path);
        return (
          <NextLink key={menu.pages} href={path}>
            <Flex
              bgColor={isActive ? "GreenPrimary.600" : "GreenPrimary.700"}
              _hover={{ background: "GreenPrimary.600" }}
              color="white"
              w={isExpandSidebar ? "202px" : "40px"}
              h="40px"
              p={isExpandSidebar ? 4 : 3}
              alignItems="center"
              rounded="md"
              shadow="md"
              cursor="pointer"
              gap={2}
              position="relative"
            >
              {menu.icon}
              {isExpandSidebar && (
                <Text fontSize="14px" as="b">
                  {menu.title}
                </Text>
              )}
            </Flex>
          </NextLink>
        );
      })}
    </Flex>
  );
};

export default MenuContents;
