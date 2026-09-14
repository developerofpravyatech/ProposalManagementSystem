// Central API client with seamless fallback to localStorage mock engine

const API_BASE_URL = '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('pravya_admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: res.statusText }));
      if (res.status === 401) {
        localStorage.removeItem('pravya_admin_token');
        localStorage.removeItem('pravya_admin_user');
      }
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[PMS API Client] Network request to ${endpoint} failed:`, err);
    throw err;
  }
}
