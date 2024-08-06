import { useQuery } from "@tanstack/react-query";
import { FilterParameters } from "@/components/layouts/table/TableContext";
import { getListProductCategoryPagination } from "@/http/getListProductCategory";

export const useListProductCategory = (parameters: FilterParameters) => {
  return useQuery({
    queryKey: ["product-category", parameters],
    queryFn: ({ signal }) =>
      getListProductCategoryPagination(parameters, signal),
  });
};
