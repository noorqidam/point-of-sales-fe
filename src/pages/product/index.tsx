import * as React from "react";
import { Stack } from "@chakra-ui/react";
import AppLayout from "@/components/layouts/auth/AppLayout";
import { TableContext } from "@/components/layouts/table/TableContext";
import { NextPageWithLayout } from "@/pages/page";
import TableProduct from "@/components/product/Table";

const ProductPage: NextPageWithLayout = () => {
  return (
    <Stack gap={5} m="24px" bg="white" p={6} rounded="sm">
      <TableContext>
        <TableProduct />
      </TableContext>
    </Stack>
  );
};

export default ProductPage;

ProductPage.getLayout = (page) => {
  return <AppLayout pageTitle="Product">{page}</AppLayout>;
};
