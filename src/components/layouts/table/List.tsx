import * as React from "react";
import { Table, TableContainer, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import { TableHelper } from "@/types/table";

export interface ListLayoutProps {
  data: TableHelper;
}

const ListTableLayout: React.FC<ListLayoutProps> = ({ data }) => {
  const header: JSX.Element[] = data.head.map((it, index) => (
    <Td
      key={index}
      px={6}
      py={2}
      fontWeight="bold"
      w={it.size === undefined ? "200px" : it.size}
    >
      {it.name}
    </Td>
  ));
  const body: JSX.Element[] = data.body.map((it, index) => (
    <Tr key={index}>
      {it.map((it2, index2) => (
        <Td key={index2} fontSize="13px">
          {it2.name}
        </Td>
      ))}
    </Tr>
  ));
  return (
    <TableContainer mt={6}>
      <Table>
        <Thead
          bgColor="gray.50"
          borderBottom="1px"
          borderBottomColor="gray.200"
          fontSize="12px"
        >
          <Tr>{header}</Tr>
        </Thead>
        <Tbody>{body}</Tbody>
      </Table>
    </TableContainer>
  );
};

export default ListTableLayout;
