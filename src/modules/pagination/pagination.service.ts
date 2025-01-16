import { PaginationMeta } from "./types";

export class PaginationService {
  public generateMeta({
    page,
    take,
    count,
  }: {
    page: number;
    take: number;
    count: number;
  }): PaginationMeta {
    let hasNext = false;
    let hasPrevious = false;

    if (count > take * page) {
      hasNext = true;
    }

    const isFirstPage = page === 1;
    const hasItemOnPreviousPage =
      (page - 1) * take <= count || (page - 1) * take - (count + take) < 0;

    if (!isFirstPage && hasItemOnPreviousPage) {
      hasPrevious = true;
    }

    return {
      hasNext,
      hasPrevious,
      page,
      perPage: take,
      total: count,
    };
  }
}
