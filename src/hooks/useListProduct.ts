import { useQuery } from "@tanstack/react-query";
import { FilterParameters } from "@/components/layouts/table/TableContext";
import { getListProductPagination } from "@/http/getListProduct";

export const useListProduct = (parameters: FilterParameters) => {
  return useQuery({
    queryKey: ["products", parameters],
    queryFn: ({ signal }) => getListProductPagination(parameters, signal),
  });
};
