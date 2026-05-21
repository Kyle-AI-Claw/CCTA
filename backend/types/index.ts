// Type definitions for the frontend

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  passwordHash?: string;
}

export interface Coin {
  id: string;
  userId: string;
  name?: string;
  denomination?: string;
  year?: number;
  mintMark?: string;
  country?: string;
  metal?: string;
  grade?: string;
  purchasedDate?: Date | string;
  purchasePrice?: number;
  notes?: string;
  frontImagePath?: string;
  backImagePath?: string;
  description?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  tags?: Tag[];
  _count?: {
    tags: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  createdAt: Date | string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface PaginatedResponse<T> {
  coins: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  tokens: AuthTokens;
}

export interface CoinFormData {
  name?: string;
  denomination?: string;
  year?: number;
  mintMark?: string;
  country?: string;
  metal?: string;
  grade?: string;
  purchasedDate?: string;
  purchasePrice?: number;
  notes?: string;
  description?: string;
  tagIds?: string[];
  frontImage?: File;
  backImage?: File;
}

export interface CreateCoinFormData {
  coin: Omit<Coin, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'tags'>;
  frontImage?: File;
  backImage?: File;
}

export interface UpdateCoinFormData {
  coin: Partial<Omit<Coin, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'tags'>>;
  frontImage?: File;
  backImage?: File;
}

export interface CollectionStats {
  totalCoins: number;
  byCountry: Record<string, number>;
  byYear: Record<string, number>;
  byMetal: Record<string, number>;
  byGrade: Record<string, number>;
  totalValue?: number;
  updatedAt?: string;
}

export interface ImageUploadResponse {
  path: string;
  filename: string;
  size: number;
  mimetype: string;
}
