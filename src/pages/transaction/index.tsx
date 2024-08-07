import * as React from "react";
import { Stack } from "@chakra-ui/react";
import AppLayout from "@/components/layouts/auth/AppLayout";
import { TableContext } from "@/components/layouts/table/TableContext";
import { NextPageWithLayout } from "@/pages/page";
import TableTransaction from "@/components/transaction/Table";

const TransactionPage: NextPageWithLayout = () => {
  return (
    <Stack gap={5} m="24px" bg="white" p={6} rounded="sm">
      <TableContext>
        <TableTransaction />
      </TableContext>
    </Stack>
  );
};

export default TransactionPage;

TransactionPage.getLayout = (page) => {
  return <AppLayout pageTitle="Transaction">{page}</AppLayout>;
};
