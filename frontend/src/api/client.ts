import { authApi } from './authApi';

const API_BASE_URL = '/api';

export async function apiRequest(endpoint: string, options: any = {}) {
  const token = localStorage.getItem('pravya_admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const doFetch = async (tokenToUse) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : {}),
      },
    });
  };

  try {
    let res = await doFetch(token);

    if (!res.ok && res.status === 401) {
      const newToken = await authApi.refresh();
      if (newToken) {
        res = await doFetch(newToken);
      }
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: res.statusText }));
      if (res.status === 401) {
        localStorage.removeItem('pravya_admin_token');
        localStorage.removeItem('pravya_admin_user');
        localStorage.removeItem('pravya_admin_refresh_token');
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      }
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[PMS API Client] Network request to ${endpoint} failed:`, err);
    throw err;
  }
}
