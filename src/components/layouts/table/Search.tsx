import * as React from "react";
import { Icon, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import {
  TableAction,
  useFilter,
} from "@/components/layouts/table/TableContext";

interface SearchTableProps {
  placeholder?: string;
  isIconSearch?: boolean;
}

const SearchTableLayout: React.FC<SearchTableProps> = ({
  placeholder,
  isIconSearch,
}) => {
  const { filter, dispatchFilter } = useFilter();

  const [search, setSearch] = React.useState<string>(filter.search);
  const getChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      dispatchFilter({
        type: TableAction.ACT_SEARCH,
        value: search,
      });
    }
  };
  return (
    <InputGroup w="347px">
      {isIconSearch && (
        <InputRightElement
          pointerEvents="none"
          // eslint-disable-next-line react/no-children-prop
          children={<Icon as={FiSearch} />}
        />
      )}
      <Input
        focusBorderColor="GreenPrimary.600"
        placeholder={placeholder}
        fontSize="13px"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={(event) => getChange(event)}
      />
    </InputGroup>
  );
};

export default SearchTableLayout;
