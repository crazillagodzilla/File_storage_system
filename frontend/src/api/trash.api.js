import apiClient from './axios';

export const trashApi = {
  list: (params = {}) => apiClient.get('/trash/', { params }),

  restore: (id) => apiClient.post(`/trash/${id}/restore/`),

  permanentDelete: (id) => apiClient.delete(`/trash/${id}/permanent/`),

  emptyTrash: () => apiClient.delete('/trash/empty/'),
};
