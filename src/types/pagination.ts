export const initialPagination: Pagination = {
  page: 0,
  totalPage: 0,
  totalItems: 0,
  start: 0,
  pageSize: 0,
};

export interface Pagination {
  page: number;
  totalPage: number;
  totalItems: 0;
  start: number;
  pageSize: number;
}
