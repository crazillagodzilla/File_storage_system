import apiClient from './axios';

export const foldersApi = {
  list: (params = {}) => apiClient.get('/folders/', { params }),

  getById: (id) => apiClient.get(`/folders/${id}/`),

  getContents: (id, params = {}) =>
    apiClient.get(`/folders/${id}/contents/`, { params }),

  create: (data) => apiClient.post('/folders/', data),

  update: (id, data) => apiClient.patch(`/folders/${id}/`, data),

  delete: (id) => apiClient.delete(`/folders/${id}/`),

  getBreadcrumb: (id) => apiClient.get(`/folders/${id}/breadcrumb/`),
};
