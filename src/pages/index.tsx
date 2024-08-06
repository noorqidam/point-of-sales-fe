import * as React from "react";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";

import AppLayout from "@/components/layouts/auth/AppLayout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextPageWithLayout } from "@/pages/page";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/user",
        permanent: false,
      },
    };
  }

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const IndexPage: NextPageWithLayout = () => {
  return <></>;
};

IndexPage.getLayout = (page) => {
  return <AppLayout pageTitle="Point of Sales">{page}</AppLayout>;
};

export default IndexPage;
