import * as React from "react";
import { Box, Center, Flex, Spacer, Spinner, Text } from "@chakra-ui/react";
import LimitTableLayout from "@/components/layouts/table/Limit";
import ListTableLayout from "@/components/layouts/table/List";
import PageTableLayout from "@/components/layouts/table/PageTable";
import SearchTableLayout from "@/components/layouts/table/Search";
import { Pagination } from "@/types/pagination";
import { TableHelper } from "@/types/table";

interface MainTableProps {
  title?: JSX.Element;
  pagination: Pagination;
  data: TableHelper;
  placeholder: string;
  isDisableSearch?: boolean;
  isLoading?: boolean;
}

const MainTableLayout: React.FC<MainTableProps> = ({
  title,
  pagination,
  data,
  placeholder,
  isDisableSearch,
  isLoading,
}) => {
  return (
    <Box>
      <Flex alignItems="center" gap={4}>
        {title ?? ""}
        {!isDisableSearch && <Spacer />}
        {!isDisableSearch && <SearchTableLayout placeholder={placeholder} />}
      </Flex>
      {isLoading ? (
        <Center mt={4}>
          <Spinner />
        </Center>
      ) : pagination.totalItems > 0 ? (
        <Box>
          <ListTableLayout data={data} />
          <Flex alignItems="center" mt={6} gap={4} fontSize="13px">
            <LimitTableLayout />
            <Spacer />
            <PageTableLayout pagination={pagination} />
          </Flex>
        </Box>
      ) : (
        <Text mt={4}>Data tidak ditemukan</Text>
      )}
    </Box>
  );
};

export default MainTableLayout;
