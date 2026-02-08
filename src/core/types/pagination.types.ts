// ============= PAGINATION =============

export interface PageRequest {
  page: number;
  size: number;
  direction?: 'ASC' | 'DESC';
  sortBy?: string | string[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
