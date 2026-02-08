export interface FindAllQuery {
  pageIndex?: number;
  pageSize?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}
