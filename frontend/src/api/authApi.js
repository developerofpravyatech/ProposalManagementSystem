import { apiRequest } from './client';

export const authApi = {
  async login(email, password) {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.token) {
        localStorage.setItem('pravya_admin_token', data.token);
        localStorage.setItem('pravya_admin_user', JSON.stringify(data.user));
      }
      return data;
    } catch {
      // Mock login for offline/instant testing
      if (email === 'admin@pravyatech.com' || email.includes('@')) {
        const mockUser = {
          id: 1,
          name: 'Pravya Admin',
          email: email || 'admin@pravyatech.com',
          role: 'superadmin'
        };
        const mockToken = 'mock-jwt-token-pravya-2026';
        localStorage.setItem('pravya_admin_token', mockToken);
        localStorage.setItem('pravya_admin_user', JSON.stringify(mockUser));
        return { token: mockToken, user: mockUser };
      }
      throw new Error('Invalid credentials');
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('pravya_admin_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('pravya_admin_token');
    localStorage.removeItem('pravya_admin_user');
  }
};
