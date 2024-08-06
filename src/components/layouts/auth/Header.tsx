import * as React from "react";
import {
  Box,
  Flex,
  Hide,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { HiDotsVertical } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import { TbLogout } from "react-icons/tb";
import { expandSidebar } from "@/store/main";
import { useAtom } from "jotai";

import { useSocket } from "@/lib/websocket/SocketContext";
import { useLogOut } from "@/hooks/useLogOut";

import UserAvatar from "@/components/commons/UserAvatar";
import AuthMenuDrawerButton from "@/components/layouts/auth/AuthMenuDrawerButton";
import Image from "next/image";

export interface HeaderProps {
  classNames?: string;
}

const AuthHeader: React.FC<HeaderProps> = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const socket = useSocket();

  const {
    handleLogoutAndRedirect: handleLogoutAndRedirect,
    processForceLogout,
  } = useLogOut();

  React.useEffect(() => {
    if (socket.user.forceLogout) {
      processForceLogout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    <Box as="header">
      <Flex
        alignItems="center"
        w="full"
        h="64px"
        bg="white"
        borderBottomWidth="1px"
        borderBottomColor="gray.100"
      >
        <Hide below="md">
          <HStack alignItems="center" justifyContent="center" p={5}>
            <DesktopMenuButton />
            <Image
              src="/images/logo-header.svg"
              width={37}
              height={37}
              alt="Logo"
            />
          </HStack>
        </Hide>
        <Hide above="md">
          <HStack alignItems="center" justifyContent="center" p={5}>
            <MobileMenuButton />
            <Image
              src="/images/logo-header.svg"
              width={200}
              height={200}
              alt="Logo"
            />
          </HStack>
        </Hide>
        <Spacer />
        <Flex align="center" gap="4" p={5}>
          <Menu>
            <MenuButton>
              <Hide below="md">
                <UserAvatar
                  userFullName={`${user?.firstName} ${user?.lastName}` ?? ""}
                />
              </Hide>
              <Hide above="md">
                <Icon as={HiDotsVertical} />
              </Hide>
            </MenuButton>
            <MenuList>
              <Box mx="18px">
                <HStack mb="12px">
                  <UserAvatar
                    userFullName={`${user?.firstName} ${user?.lastName}` ?? ""}
                  />
                  <Box>
                    <Text>{`${user?.firstName} ${user?.lastName}` ?? ""}</Text>
                  </Box>
                </HStack>
                <MenuItem
                  my="12px"
                  gap={2}
                  _hover={{ background: "gray.100" }}
                  onClick={() => handleLogoutAndRedirect()}
                >
                  <Icon as={TbLogout} fontSize={25} color="GrayPrimary.600" />
                  Logout
                </MenuItem>
              </Box>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};

const DesktopMenuButton = () => {
  const [isExpandSidebar, setIsExpandSidebar] = useAtom(expandSidebar);
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  React.useEffect(() => {
    if (isLargerThan768) {
      setIsExpandSidebar(false);
    }
  }, [isLargerThan768, setIsExpandSidebar]);

  return (
    <IconButton
      w="24px"
      h="24px"
      icon={<Icon as={GiHamburgerMenu} />}
      aria-label="Menu Collapse"
      mr={{ md: 8 }}
      onClick={() => setIsExpandSidebar(!isExpandSidebar)}
    />
  );
};

const MobileMenuButton = () => {
  return <AuthMenuDrawerButton />;
};

export default AuthHeader;
