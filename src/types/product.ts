export type ProductCategory =
  | 'electronics'
  | 'fashion'
  | 'home'
  | 'sports'
  | 'books';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  inventoryCount: number;
  createdAt: string;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  inventoryCount: number;
}

export interface ProductFilters {
  searchTerm?: string;
  category?: ProductCategory | 'all';
}

