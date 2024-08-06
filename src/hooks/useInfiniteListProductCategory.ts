import { useInfiniteQuery } from "@tanstack/react-query";
import { FilterParameters } from "@/components/layouts/table/TableContext";
import { getListProductCategoryPagination } from "@/http/getListProductCategory";

export const useInfiniteListProductCategory = (
  parameters: FilterParameters
) => {
  return useInfiniteQuery({
    queryKey: ["infinite-product-category", parameters],
    queryFn: ({ pageParam = 1, signal }) =>
      getListProductCategoryPagination(
        { ...parameters, page: pageParam },
        signal
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPage) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};
