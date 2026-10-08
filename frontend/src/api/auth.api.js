import apiClient from './axios';

export const authApi = {
  login: (credentials) => apiClient.post('/auth/login/', credentials),

  register: (userData) => apiClient.post('/auth/register/', userData),

  logout: () => {
    const refreshToken = localStorage.getItem('refresh_token');
    return apiClient.post('/auth/logout/', { refresh: refreshToken });
  },

  getCurrentUser: () => apiClient.get('/auth/me/'),

  forgotPassword: (email) => apiClient.post('/auth/password/reset/', { email }),

  resetPassword: (data) => apiClient.post('/auth/password/reset/confirm/', data),

  changePassword: (data) => apiClient.post('/auth/password/change/', data),

  updateProfile: (data) => apiClient.patch('/auth/me/', data),
};
