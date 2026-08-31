import { apiRequest } from './client';

export const authApi = {
  async login(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const accessToken = data.access_token || data.token;
    if (accessToken) {
      localStorage.setItem('pravya_admin_token', accessToken);
    }
    const user = await apiRequest('/auth/me').catch(() => null);
    if (user) {
      localStorage.setItem('pravya_admin_user', JSON.stringify(user));
    }
    return { ...data, token: accessToken, user };
  },

  async getCurrentUser() {
    try {
      const data = await apiRequest('/auth/me');
      return data;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('pravya_admin_token');
    localStorage.removeItem('pravya_admin_user');
  }
};
