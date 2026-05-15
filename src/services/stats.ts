import api from './api';
import type { CollectionStats } from '../types';

export const statsService = {
  // Get collection statistics
  async getStats(): Promise<CollectionStats> {
    const response = await api.get('/stats');
    return response.data.data;
  },
};