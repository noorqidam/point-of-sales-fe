import { useQuery } from "@tanstack/react-query";
import { FilterParameters } from "@/components/layouts/table/TableContext";
import { getListUsersPagination } from "@/http/getListUsers";

export const useListUser = (parameters: FilterParameters) => {
  return useQuery({
    queryKey: ["users", parameters],
    queryFn: ({ signal }) => getListUsersPagination(parameters, signal),
  });
};
