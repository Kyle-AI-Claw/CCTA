import { Prisma } from '@prisma/client';

export interface Coin {
  id: string;
  userId: string;
  name?: string | null;
  denomination?: string | null;
  year?: number | null;
  mintMark?: string | null;
  country?: string | null;
  metal?: string | null;
  grade?: string | null;
  purchasedDate?: Date | null;
  purchasePrice?: number | null;
  notes?: string | null;
  description?: string | null;
  frontImagePath?: string | null;
  backImagePath?: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags?: Array<{ tag: { id: string; name: string } }> | null;
  _count?: { tags?: number } | null;
}

export type CreateCoinData = Prisma.CoinCreateInput;
export type UpdateCoinData = Prisma.CoinUpdateInput;
