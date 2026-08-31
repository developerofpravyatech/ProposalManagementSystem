// Central API client with seamless fallback to localStorage mock engine

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('pravya_admin_token');
  const headers = {
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
      throw new Error(errorData.detail || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    // If backend is offline or network error, let caller handle fallback or rethrow
    console.warn(`[PMS API Client] Network request to ${endpoint} failed, checking local engine:`, err.message);
    throw err;
  }
}
