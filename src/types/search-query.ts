export interface FindAllQuery {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}
