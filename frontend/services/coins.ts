import type { Coin, CoinFormData, PaginatedResponse } from '../types';
import { config } from '../config';

const API_BASE_URL = config.apiUrl;

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
};

export const coinsService = {
  async getCoins(params?: {
    page?: number;
    limit?: number;
    search?: string;
    country?: string;
    year?: number;
    denomination?: string;
    metal?: string;
    grade?: string;
  }): Promise<PaginatedResponse<Coin>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/coins?${queryParams}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch coins');
    }

    const data = await response.json();
    return data.data;
  },

  async getCoinById(id: string): Promise<Coin> {
    const response = await fetch(`${API_BASE_URL}/coins/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch coin');
    }

    const data = await response.json();
    return data.data;
  },

  async createCoin(formData: { coin: Partial<Coin> }): Promise<Coin> {
    const response = await fetch(`${API_BASE_URL}/coins`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to create coin');
    }

    const data = await response.json();
    return data.data;
  },

  async updateCoin(id: string, formData: { coin: Partial<Coin> }): Promise<Coin> {
    const response = await fetch(`${API_BASE_URL}/coins/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to update coin');
    }

    const data = await response.json();
    return data.data;
  },

  async deleteCoin(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/coins/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete coin');
    }
  },
};