import apiClient from './axios';

export const storageApi = {
  getUsage: () => apiClient.get('/storage/'),

  getStats: () => apiClient.get('/storage/stats/'),
};
