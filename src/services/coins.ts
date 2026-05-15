import api from './api';
import type { Coin, CoinFormData, PaginatedResponse, CreateCoinFormData, UpdateCoinFormData } from '../types';

export const coinsService = {
  // Get all coins with pagination and filtering
  async getCoins(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string[];
    country?: string;
    year?: number;
    denomination?: string;
    metal?: string;
    grade?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Coin>> {
    const response = await api.get('/coins', { params });
    return response.data.data;
  },

  // Get single coin
  async getCoin(id: string): Promise<Coin> {
    const response = await api.get(`/coins/${id}`);
    return response.data.data;
  },

  // Create coin
  async createCoin(formData: CreateCoinFormData): Promise<Coin> {
    const form = new FormData();
    form.append('coin', JSON.stringify(formData.coin));

    if (formData.frontImage) {
      form.append('frontImage', formData.frontImage);
    }
    if (formData.backImage) {
      form.append('backImage', formData.backImage);
    }

    const response = await api.post('/coins', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  // Update coin
  async updateCoin(id: string, formData: UpdateCoinFormData): Promise<Coin> {
    const form = new FormData();
    form.append('coin', JSON.stringify(formData.coin));

    if (formData.frontImage) {
      form.append('frontImage', formData.frontImage);
    }
    if (formData.backImage) {
      form.append('backImage', formData.backImage);
    }

    const response = await api.put(`/coins/${id}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  // Delete coin
  async deleteCoin(id: string): Promise<void> {
    await api.delete(`/coins/${id}`);
  },
};