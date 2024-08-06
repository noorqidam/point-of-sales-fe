import * as React from "react";
import { Box, Icon, Text } from "@chakra-ui/react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import {
  TableAction,
  useFilter,
} from "@/components/layouts/table/TableContext";
import { Pagination } from "@/types/pagination";

interface PageTableProps {
  pagination: Pagination;
}

const PageTableLayout: React.FC<PageTableProps> = ({ pagination }) => {
  const { filter, dispatchFilter } = useFilter();
  const pagPage = filter.page;
  return (
    <>
      <Text>
        {pagination.start}-
        {(pagination.start ?? 0) + (pagination.pageSize ?? filter.limit) - 1} of{" "}
        {pagination.totalItems}
      </Text>
      <Box
        cursor={pagPage === 1 ? "not-allowed" : "pointer"}
        onClick={() =>
          dispatchFilter({
            type: TableAction.ACT_PAGE,
            value: pagPage === 1 ? pagPage : pagPage - 1,
          })
        }
      >
        <Icon
          as={BiChevronLeft}
          size={15}
          color={pagPage === 1 ? "gray" : "black"}
        />
      </Box>
      <Box
        cursor={pagPage === pagination.totalPage ? "not-allowed" : "pointer"}
        onClick={() =>
          dispatchFilter({
            type: TableAction.ACT_PAGE,
            value: pagPage === pagination.totalPage ? pagPage : pagPage + 1,
          })
        }
      >
        <Icon
          as={BiChevronRight}
          size={15}
          color={pagPage === pagination.totalPage ? "gray" : "black"}
        />
      </Box>
    </>
  );
};

export default PageTableLayout;
