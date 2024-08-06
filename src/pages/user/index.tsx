import * as React from "react";
import { Stack } from "@chakra-ui/react";
import AppLayout from "@/components/layouts/auth/AppLayout";
import { TableContext } from "@/components/layouts/table/TableContext";
import { NextPageWithLayout } from "@/pages/page";
import TableUser from "@/components/users/Table";

const UserPage: NextPageWithLayout = () => {
  return (
    <Stack gap={5} m="24px" bg="white" p={6} rounded="sm">
      <TableContext>
        <TableUser />
      </TableContext>
    </Stack>
  );
};

export default UserPage;

UserPage.getLayout = (page) => {
  return <AppLayout pageTitle="User">{page}</AppLayout>;
};
