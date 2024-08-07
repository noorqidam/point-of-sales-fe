import { useQuery } from "@tanstack/react-query";
import { FilterParameters } from "@/components/layouts/table/TableContext";
import { getListTransactionsPagination } from "@/http/getListTransactions";

export const useListTransaction = (parameters: FilterParameters) => {
  return useQuery({
    queryKey: ["transactions", parameters],
    queryFn: ({ signal }) => getListTransactionsPagination(parameters, signal),
  });
};
