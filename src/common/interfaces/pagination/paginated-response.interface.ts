import { PaginationMeta } from './pagination-meta.interface';

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
