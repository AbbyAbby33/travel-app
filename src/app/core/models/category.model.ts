export interface KeyValueItem {
  id: number | 'all';
  name: string;
}

export interface CategoriesData {
  Category?: KeyValueItem[];
  Friendly?: KeyValueItem[];
  Services?: KeyValueItem[];
  Target?: KeyValueItem[];
}

export interface CategoriesResponse {
  total: number;
  data: CategoriesData;
}