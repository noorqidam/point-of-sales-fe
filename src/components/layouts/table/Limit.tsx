import * as React from "react";
import { HStack, Select, Text } from "@chakra-ui/react";
import {
  TableAction,
  useFilter,
} from "@/components/layouts/table/TableContext";

interface LimitTableProps {}

const LimitTableLayout: React.FC<LimitTableProps> = () => {
  const { filter, dispatchFilter } = useFilter();

  return (
    <HStack>
      <Text>Show rows per page</Text>
      <Select
        value={filter.limit}
        onChange={(event) =>
          dispatchFilter({
            type: TableAction.ACT_LIMIT,
            value: Number.parseInt(event.target.value),
          })
        }
        w="75px"
        h="32px"
        fontSize="13px"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </Select>
    </HStack>
  );
};

export default LimitTableLayout;
