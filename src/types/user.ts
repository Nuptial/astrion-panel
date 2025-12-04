export type UserRole = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  location: string;
  department: string;
  bio: string;
  createdAt: string;
}

export interface UserPayload {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  location: string;
  department: string;
  bio: string;
}

export interface UserFilters {
  searchTerm?: string;
}

