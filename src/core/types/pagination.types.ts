// ============= PAGINATION =============

export interface PageRequest {
  page: number;
  size: number;
  direction?: 'ASC' | 'DESC';
  sortBy?: string | string[];
}

// Matches BE PageResDTOObject
export interface PageResponse<T> {
  page: number;
  size: number;
  total_page: number;
  total: number;
  items: T[];
}
