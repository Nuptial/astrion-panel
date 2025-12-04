import type { Product, ProductFilters, ProductPayload } from '@/types/product';
import { generateId } from '@/utils/generateId';
import { simulateDelay } from '@/utils/simulateDelay';

const initialProducts: Product[] = [
  {
    id: 'p-1',
    name: 'Wireless Headphones Pro',
    description: 'Premium over-ear headphones with active noise cancelling and 32 hours of battery life.',
    price: 5499,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=60',
    inventoryCount: 25,
    createdAt: '2024-08-14T09:00:00.000Z',
  },
  {
    id: 'p-2',
    name: 'Smart Fitness Watch',
    description: 'Next-gen wearable with 12 sport modes, GPS, and advanced sleep tracking.',
    price: 2999,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=60',
    inventoryCount: 42,
    createdAt: '2024-07-02T11:30:00.000Z',
  },
  {
    id: 'p-3',
    name: 'Minimalist Sofa Set',
    description: 'Water-resistant fabric, beech wood legs, and an ergonomic silhouette for modern living rooms.',
    price: 12499,
    category: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1484100356142-db6ab6244067?auto=format&fit=crop&w=800&q=60',
    inventoryCount: 8,
    createdAt: '2024-05-20T14:15:00.000Z',
  },
  {
    id: 'p-4',
    name: 'Aero Running Shoes',
    description: 'Breathable mesh upper, lightweight midsole, and ideal support for mid-distance runs.',
    price: 1899,
    category: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=60',
    inventoryCount: 63,
    createdAt: '2024-04-10T08:45:00.000Z',
  },
  {
    id: 'p-5',
    name: 'Modern Reading Lamp',
    description: 'Energy-efficient LED desk lamp with three brightness levels and a minimalist profile.',
    price: 749,
    category: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1467043153537-a4f570f14c15?auto=format&fit=crop&w=800&q=60',
    inventoryCount: 37,
    createdAt: '2024-03-18T17:20:00.000Z',
  },
  {
    id: 'p-6',
    name: 'Leading in Business',
    description: 'Best-selling business book packed with inspirational leadership stories and practical frameworks.',
    price: 389,
    category: 'books',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=60',
    inventoryCount: 120,
    createdAt: '2024-01-12T09:40:00.000Z',
  },
];

let products = [...initialProducts];

const filterProducts = (list: Product[], filters?: ProductFilters): Product[] => {
  if (!filters) {
    return list;
  }

  const { searchTerm, category } = filters;

  return list.filter((product) => {
    const matchesCategory = category && category !== 'all' ? product.category === category : true;

    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });
};

const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  const filtered = filterProducts(products, filters);
  return simulateDelay(filtered);
};

const getProductById = async (id: string): Promise<Product> => {
  const product = products.find((item) => item.id === id);

  if (!product) {
    throw new Error('Product not found.');
  }

  return simulateDelay(product);
};

const createProduct = async (payload: ProductPayload): Promise<Product> => {
  const newProduct: Product = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...payload,
  };

  products = [newProduct, ...products];
  return simulateDelay(newProduct);
};

const updateProduct = async (id: string, payload: ProductPayload): Promise<Product> => {
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    throw new Error('Product not found.');
  }

  const updatedProduct: Product = {
    ...products[index],
    ...payload,
  };

  products = [...products.slice(0, index), updatedProduct, ...products.slice(index + 1)];
  return simulateDelay(updatedProduct);
};

const deleteProduct = async (id: string): Promise<void> => {
  const exists = products.some((product) => product.id === id);

  if (!exists) {
    throw new Error('Product not found.');
  }

  products = products.filter((product) => product.id !== id);
  await simulateDelay(true);
};

export const productsService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

