export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export interface PaginationMeta {
  hasNext: boolean;
  hasPrevious: boolean;
  page: number;
  perPage: number;
  total: number;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
