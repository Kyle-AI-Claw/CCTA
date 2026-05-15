import { useState, useEffect } from 'react';
import { coinsService } from '../services/coins';
import type { Coin, CoinFormData, PaginatedResponse } from '../types';

export function useCoins() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoins = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    country?: string;
    year?: number;
    denomination?: string;
    metal?: string;
    grade?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await coinsService.getCoins(params);
      setCoins(response.coins);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch coins');
    } finally {
      setLoading(false);
    }
  };

  const createCoin = async (formData: CoinFormData) => {
    setLoading(true);
    setError(null);
    try {
      const newCoin = await coinsService.createCoin({
        coin: formData,
      });
      setCoins(prev => [newCoin, ...prev]);
      return newCoin;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create coin');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCoin = async (id: string, formData: CoinFormData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCoin = await coinsService.updateCoin(id, {
        coin: formData,
      });
      setCoins(prev => prev.map(coin => coin.id === id ? updatedCoin : coin));
      return updatedCoin;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update coin');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCoin = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await coinsService.deleteCoin(id);
      setCoins(prev => prev.filter(coin => coin.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete coin');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    coins,
    loading,
    error,
    fetchCoins,
    createCoin,
    updateCoin,
    deleteCoin,
  };
}
