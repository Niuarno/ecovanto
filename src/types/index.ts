export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'ONE SIZE';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  category: string;
  categorySlug: string;
  collection: string;
  collectionSlug: string;
  sizes: Size[];
  colors: ProductColor[];
  badge?: 'BEST SELLER' | 'NEW DROP' | 'ARCHIVE' | 'SPECIAL EDITION' | 'RUNWAY';
  tagline?: string;
  description: string;
  details: string[];
  care: string[];
  shippingInfo?: string;
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  image: string;
  description: string;
  editorialQuote?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  season: string;
  year: string;
  heroImage: string;
  description: string;
  manifesto: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  selectedSize: Size;
  selectedColor: ProductColor;
  quantity: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message?: string;
  productImage?: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';
