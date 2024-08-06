import { Alert } from "@/types/alert";
import { Pagination } from "@/types/pagination";

export interface Response<R = Record<string, string>, T = Pagination> {
  message: Alert;
  data: R;
  pagination: T;
}
