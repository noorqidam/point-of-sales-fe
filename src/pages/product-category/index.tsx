import * as React from "react";
import { Stack } from "@chakra-ui/react";
import AppLayout from "@/components/layouts/auth/AppLayout";
import { TableContext } from "@/components/layouts/table/TableContext";
import { NextPageWithLayout } from "@/pages/page";
import TableProductCategory from "@/components/product-category/Table";

const ProductCategoryPage: NextPageWithLayout = () => {
  return (
    <Stack gap={5} m="24px" bg="white" p={6} rounded="sm">
      <TableContext>
        <TableProductCategory />
      </TableContext>
    </Stack>
  );
};

export default ProductCategoryPage;

ProductCategoryPage.getLayout = (page) => {
  return <AppLayout pageTitle="Product Category">{page}</AppLayout>;
};
