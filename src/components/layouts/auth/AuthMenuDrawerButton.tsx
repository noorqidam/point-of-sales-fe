import * as React from "react";
import {
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Icon,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GiHamburger } from "react-icons/gi";
import MenuContents from "@/components/layouts/auth/MenuContents";

export interface AuthMenuDrawerButtonProps {}

const AuthMenuDrawerButton: React.FC<AuthMenuDrawerButtonProps> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  React.useEffect(() => {
    router.events.on("routeChangeComplete", onClose);
    return () => {
      router.events.off("routeChangeComplete", onClose);
    };
  }, [onClose, router.events]);

  return (
    <>
      <IconButton
        w="24px"
        h="24px"
        icon={<Icon as={GiHamburger} />}
        aria-label="Menu Collapse"
        mr={{ md: 8 }}
        onClick={() => onOpen()}
      />
      <Drawer placement="top" onClose={onClose} isOpen={isOpen} size="full">
        <DrawerOverlay />
        <DrawerContent
          bgColor="GreenPrimary.600"
          overflow="auto"
          display="flex"
          justifyContent="start"
          alignItems="center"
          p="4"
        >
          <DrawerCloseButton color="white" />
          <MenuContents />
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AuthMenuDrawerButton;
