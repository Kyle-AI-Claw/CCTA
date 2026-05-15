import api from './api';
import type { Tag, Category, ApiResponse } from '../types';

export const tagsService = {
  // Get all tags
  async getAllTags(): Promise<Tag[]> {
    const response = await api.get('/tags');
    return response.data.data;
  },

  // Create tag
  async createTag(name: string): Promise<Tag> {
    const response = await api.post('/tags', { name });
    return response.data.data;
  },

  // Delete tag
  async deleteTag(id: string): Promise<void> {
    await api.delete(`/tags/${id}`);
  },

  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data.data;
  },
};