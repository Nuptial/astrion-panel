import type { User, UserFilters, UserPayload } from '@/types/user';
import { generateId } from '@/utils/generateId';
import { simulateDelay } from '@/utils/simulateDelay';

const initialUsers: User[] = [
  {
    id: 'u-1',
    fullName: 'Maya Collins',
    email: 'maya@astrionpanel.com',
    phone: '+1 555 123 4567',
    role: 'admin',
    status: 'active',
    location: 'New York, USA',
    department: 'Product Management',
    bio: 'Product leader with eight years of experience in UX research and experimentation.',
    createdAt: '2023-11-12T10:00:00.000Z',
  },
  {
    id: 'u-2',
    fullName: 'Ethan Reid',
    email: 'ethan@astrionpanel.com',
    phone: '+1 512 555 9876',
    role: 'editor',
    status: 'active',
    location: 'Austin, USA',
    department: 'Marketing',
    bio: 'Content strategist focused on brand storytelling and lifecycle campaigns.',
    createdAt: '2024-01-05T09:30:00.000Z',
  },
  {
    id: 'u-3',
    fullName: 'Lena Hart',
    email: 'lena@astrionpanel.com',
    phone: '+44 20 7946 0200',
    role: 'viewer',
    status: 'inactive',
    location: 'London, UK',
    department: 'Support',
    bio: 'Customer advocate who specializes in building empathetic support journeys.',
    createdAt: '2022-09-22T14:15:00.000Z',
  },
  {
    id: 'u-4',
    fullName: 'Aaron Wells',
    email: 'aaron@astrionpanel.com',
    phone: '+1 650 555 7788',
    role: 'editor',
    status: 'active',
    location: 'San Francisco, USA',
    department: 'Operations',
    bio: 'Operations manager driving process optimization across logistics programs.',
    createdAt: '2024-03-03T08:50:00.000Z',
  },
];

let users = [...initialUsers];

const filterUsers = (list: User[], filters?: UserFilters): User[] => {
  if (!filters?.searchTerm) {
    return list;
  }

  const keyword = filters.searchTerm.toLowerCase();
  return list.filter(
    (user) =>
      user.fullName.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      user.department.toLowerCase().includes(keyword),
  );
};

const getUsers = async (filters?: UserFilters): Promise<User[]> => {
  const filtered = filterUsers(users, filters);
  return simulateDelay(filtered);
};

const getUserById = async (id: string): Promise<User> => {
  const user = users.find((item) => item.id === id);

  if (!user) {
    throw new Error('User not found.');
  }

  return simulateDelay(user);
};

const updateUser = async (id: string, payload: UserPayload): Promise<User> => {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    throw new Error('User not found.');
  }

  const updatedUser: User = { ...users[index], ...payload };
  users = [...users.slice(0, index), updatedUser, ...users.slice(index + 1)];
  return simulateDelay(updatedUser);
};

const deleteUser = async (id: string): Promise<void> => {
  const exists = users.some((user) => user.id === id);

  if (!exists) {
    throw new Error('User not found.');
  }

  users = users.filter((user) => user.id !== id);
  await simulateDelay(true);
};

const createUser = async (payload: UserPayload): Promise<User> => {
  const newUser: User = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...payload,
  };

  users = [newUser, ...users];
  return simulateDelay(newUser);
};

export const usersService = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
};

