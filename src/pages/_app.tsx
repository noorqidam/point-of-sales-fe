import { ChakraProvider } from "@chakra-ui/react";
import type { DehydratedState } from "@tanstack/react-query";
import {
  hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as JotaiProvider } from "jotai";
import { NextPageContext } from "next";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import Head from "next/head";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";

import AuthWrapper from "@/lib/auth/AuthWrapper";
import { SocketProvider } from "@/lib/websocket/SocketContext";

import TimeoutSession from "@/components/layouts/auth/Timeout";

import { NextPageWithLayout } from "@/pages/page";
import { theme } from "@/theme";
import { useClearQueriesOnLogin } from "@/hooks/utils/useClearQueriesOnLogin";
import { useNotifyBrowserUpdates } from "@/hooks/utils/useNotifyBrowserUpdates";

type PageProps = {
  dehydratedState?: DehydratedState;
  session: Session;
};

type AppPropsWithLayout<P = {}> = {
  err?: NextPageContext["err"];
  Component: NextPageWithLayout;
} & AppProps<P>;

const AppHead = () => {
  return (
    <Head>
      <link rel="shortcut icon" href="/favicon/favicon.svg" />
      <link rel="icon" href="/favicon/faicon.svg" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
    </Head>
  );
};

function MyApp({
  Component,
  pageProps: { session, dehydratedState, ...pageProps },
}: AppPropsWithLayout<PageProps>) {
  const getLayout = Component.getLayout || ((page) => page);
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      })
  );

  if (dehydratedState) {
    hydrate(queryClient, dehydratedState);
  }

  useClearQueriesOnLogin({ queryClient });
  useNotifyBrowserUpdates();

  return (
    <>
      <AppHead />
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <JotaiProvider>
            <ChakraProvider theme={theme}>
              <TimeoutSession>
                <AuthWrapper>
                  <SocketProvider>{getLayout(<Component />)}</SocketProvider>
                </AuthWrapper>
              </TimeoutSession>
            </ChakraProvider>
          </JotaiProvider>
        </SessionProvider>
        <ReactQueryDevtools initialIsOpen={false} position="right" />
      </QueryClientProvider>
    </>
  );
}

MyApp.getInitialProps = async (context: AppContext) => {
  if (context?.ctx?.res) {
    context.ctx.res?.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
    );
  }

  const appProps = await App.getInitialProps(context);

  return {
    ...appProps,
  };
};

export default MyApp;
