import type { ProductCategory } from '@/types/product';
import type { UserRole, UserStatus } from '@/types/user';

export const PRODUCT_CATEGORIES: { label: string; value: ProductCategory }[] = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Home & Living', value: 'home' },
  { label: 'Sports & Outdoor', value: 'sports' },
  { label: 'Books', value: 'books' },
];

export const USER_ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
];

export const USER_STATUS_OPTIONS: { label: string; value: UserStatus }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

