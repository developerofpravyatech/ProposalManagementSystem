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

  async register(fullName, email, password) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ full_name: fullName, email, password }),
    });
    return data;
  },

  async requestPasswordReset(email) {
    const data = await apiRequest('/auth/password-reset/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return data;
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
    if (!refreshToken) {
      console.log('[Auth] No refresh token available');
      return null;
    }
    try {
      console.log('[Auth] Attempting token refresh...');
      const res = await fetch('/api/auth/refresh?token=' + encodeURIComponent(refreshToken), {
        method: 'POST',
      });
      console.log('[Auth] Refresh response status:', res.status);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('[Auth] Refresh failed:', errorData);
        localStorage.removeItem(REFRESH_KEY);
        return null;
      }
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem('pravya_admin_token', data.access_token);
        console.log('[Auth] Token refreshed successfully');
      }
      if (data.refresh_token) {
        localStorage.setItem(REFRESH_KEY, data.refresh_token);
      }
      return data.access_token || null;
    } catch (err) {
      console.error('[Auth] Refresh error:', err);
      localStorage.removeItem(REFRESH_KEY);
      return null;
    }
  },

  logout() {
    localStorage.removeItem('pravya_admin_token');
    localStorage.removeItem('pravya_admin_user');
    localStorage.removeItem(REFRESH_KEY);
  }
};
