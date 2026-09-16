import { apiRequest } from './client';

const REFRESH_KEY = 'pravya_admin_refresh_token';

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
    if (data.refresh_token) {
      localStorage.setItem(REFRESH_KEY, data.refresh_token);
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

  async refresh() {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) return null;
    const res = await fetch('/api/auth/refresh?token=' + encodeURIComponent(refreshToken), {
      method: 'POST',
    });
    if (!res.ok) {
      localStorage.removeItem(REFRESH_KEY);
      return null;
    }
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem('pravya_admin_token', data.access_token);
    }
    if (data.refresh_token) {
      localStorage.setItem(REFRESH_KEY, data.refresh_token);
    }
    return data.access_token || null;
  },

  logout() {
    localStorage.removeItem('pravya_admin_token');
    localStorage.removeItem('pravya_admin_user');
    localStorage.removeItem(REFRESH_KEY);
  }
};
