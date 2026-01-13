
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  createdAt: number;
}

export interface SearchResult {
  productId: string;
  confidence: number;
  reason: string;
}

export type ViewMode = 'inventory' | 'search' | 'stats';
