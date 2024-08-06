import * as React from "react";
import {
  GroupBase,
  OptionBase,
  Select,
  useChakraSelectProps,
} from "chakra-react-select";
import { useInfiniteListProductCategory } from "@/hooks/useInfiniteListProductCategory";
import { useFilter } from "@/components/layouts/table/TableContext";

interface CategoryOption extends OptionBase {
  label: string;
  value: number;
}

export interface DropdownProductCategoryProps {
  selectedCategory: { id: number } | null;
  setSelectedCategory: (newValue: { id: number } | null) => void;
  isDisabled?: boolean;
}

const DropdownProductCategory: React.FC<DropdownProductCategoryProps> = ({
  selectedCategory,
  setSelectedCategory,
  isDisabled,
}) => {
  const { filter } = useFilter();
  const {
    data: categoryListData,
    isLoading: isLoadingCategoryList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteListProductCategory(filter);

  const selectOptions: Array<CategoryOption> =
    categoryListData?.pages.flatMap((page) =>
      page.data.map((it) => ({
        label: it.categoryName ?? "",
        value: it.id ?? 0,
      }))
    ) ?? [];

  const handleScrollToBottom = async (event: WheelEvent | TouchEvent) => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  };

  const selectProps = useChakraSelectProps<
    CategoryOption,
    false,
    GroupBase<CategoryOption>
  >({
    focusBorderColor: "green.500",
    colorScheme: "green",
    isMulti: false,
    value:
      selectOptions.find((option) => option.value === selectedCategory?.id) ??
      null,
    isDisabled,
    onChange: (newValue) => {
      setSelectedCategory(newValue ? { id: newValue.value } : null);
    },
    onMenuScrollToBottom: handleScrollToBottom,
  });

  return (
    <Select
      size="sm"
      name="category"
      placeholder="Select Category"
      useBasicStyles
      colorScheme="green"
      options={selectOptions}
      isLoading={isLoadingCategoryList || isFetchingNextPage}
      {...selectProps}
    />
  );
};

export default DropdownProductCategory;
