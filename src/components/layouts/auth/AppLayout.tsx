import * as React from "react";
import { Box, Flex, Hide, useMediaQuery } from "@chakra-ui/react";
import { useAtom } from "jotai";
import Head from "next/head";
import { useRouter } from "next/router";
import { accessFromDesktop } from "@/store/main";
import { AnimatePresence, motion } from "framer-motion";
import AuthSidebar from "./AuthSidebar";
import Header from "./Header";

export interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  overridePageTitle?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  pageTitle = "Page",
  overridePageTitle,
}) => {
  const pageTitleFormatted = overridePageTitle
    ? pageTitle
    : `Deptech | ${pageTitle}`;

  const { asPath } = useRouter();
  const [_, setDesktopMode] = useAtom(accessFromDesktop);
  const [isLargeThanMD] = useMediaQuery("(min-width: 48em)");

  React.useEffect(() => {
    setDesktopMode(isLargeThanMD);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLargeThanMD]);

  const variants = {
    hidden: { opacity: 0, x: -200, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
  };

  return (
    <Box w="full" h="100vh" bgColor="gray.100">
      <Head>
        <title>{pageTitleFormatted}</title>
      </Head>
      <Flex flexDirection="column">
        <Box w="full" h="63px">
          <Header />
        </Box>
        <Flex w="full" h="calc(100vh - 63px)">
          <Hide below="md">
            <AuthSidebar />
          </Hide>
          <Box h="full" w="full" overflow={{ md: "auto" }}>
            <AnimatePresence
              mode="wait"
              initial={false}
              onExitComplete={() => window.scrollTo(0, 0)}
            >
              <motion.div
                key={asPath}
                variants={variants}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{ type: "linear" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default AppLayout;
