import apiClient from './axios';

export const filesApi = {
  list: (params = {}) => apiClient.get('/files/', { params }),

  getById: (id) => apiClient.get(`/files/${id}/`),

  upload: (formData, onUploadProgress) =>
    apiClient.post('/files/upload/', formData, {
      onUploadProgress,
    }),

  update: (id, data) => apiClient.patch(`/files/${id}/`, data),

  delete: (id) => apiClient.delete(`/files/${id}/`),

  download: (id) =>
    apiClient.get(`/files/${id}/download/`, { responseType: 'blob' }),

  getRecent: (params = {}) => apiClient.get('/files/recent/', { params }),

  getFavorites: (params = {}) => apiClient.get('/files/favorites/', { params }),

  getShared: (params = {}) => apiClient.get('/files/shared/', { params }),

  toggleFavorite: (id) => apiClient.post(`/files/${id}/favorite/`),

  removeFavorite: (id) => apiClient.delete(`/files/${id}/favorite/`),

  share: (id, data) => apiClient.post(`/files/${id}/share/`, data),

  search: (query, params = {}) =>
    apiClient.get('/files/search/', { params: { q: query, ...params } }),
};
