import { FilterParameters } from "@/components/layouts/table/TableContext";
import { apiClient } from "@/http/api-client";
import { initialPagination } from "@/types/pagination";
import { Response } from "@/types/Response";
import { Transaction } from "@/types/transaction/Transaction";

export type TransactionResponse = Response<Array<Transaction>>;

export const getListTransactionsPagination = async (
  parameters: FilterParameters,
  signal: AbortSignal | undefined
) => {
  const parameters_ = {
    page: parameters.page,
    perPage: parameters.limit,
    transactionType: parameters.search,
  };

  try {
    const result = await apiClient.get<TransactionResponse>(
      `/transaction/list`,
      {
        params: parameters_,
        signal,
      }
    );

    return result.data;
  } catch {
    return {
      data: [],
      pagination: initialPagination,
    };
  }
};
