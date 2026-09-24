import PRODUCTS from '@/data/products.json';

export type Product = (typeof PRODUCTS)[number];

export function listProducts(): Product[] {
  return PRODUCTS as Product[];
}

export function getProduct(id: string): Product | undefined {
  return listProducts().find((p) => p.id === id);
}
