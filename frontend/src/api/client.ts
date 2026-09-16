import { authApi } from './authApi';

const API_BASE_URL = '/api';
const REQUEST_TIMEOUT_MS = 30000;

function timeoutSignal(signal?: AbortSignal): AbortSignal {
  let timeoutId: ReturnType<typeof setTimeout>;
  const controller = new AbortController();
  timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  if (signal) {
    signal.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      controller.abort();
    });
  }
  return controller.signal;
}

export async function apiRequest(endpoint: string, options: any = {}) {
  const token = localStorage.getItem('pravya_admin_token');
  
  // Debug: Log token presence
  console.log(`[API] ${options.method || 'GET'} ${endpoint}`, {
    hasToken: !!token,
    tokenPrefix: token ? token.substring(0, 20) + '...' : 'none',
    bodySize: options.body ? options.body.length : 0
  });

  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const doFetch = async (tokenToUse: string | null, signal?: AbortSignal) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : {}),
      },
      signal: timeoutSignal(signal),
    });
  };

  try {
    let res = await doFetch(token);

    if (!res.ok && res.status === 401) {
      console.log('[API] 401 received, attempting token refresh...');
      const newToken = await authApi.refresh();
      if (newToken) {
        console.log('[API] Token refreshed, retrying request...');
        res = await doFetch(newToken);
      } else {
        console.log('[API] Token refresh failed');
      }
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: res.statusText }));
      if (res.status === 401) {
        console.warn(`[API] Auth failure (401) on ${options.method || 'GET'} ${endpoint} — logging out`);
        localStorage.removeItem('pravya_admin_token');
        localStorage.removeItem('pravya_admin_user');
        localStorage.removeItem('pravya_admin_refresh_token');
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
        throw new Error('Session expired. Please log in again.');
      } else if (res.status >= 500) {
        console.error(`[API] Server error (${res.status}) on ${options.method || 'GET'} ${endpoint}:`, errorData);
        throw new Error('Server error. Please try again later.');
      } else {
        console.error(`[API] Request failed (${res.status}) on ${options.method || 'GET'} ${endpoint}:`, errorData);
        throw new Error(errorData.detail || `Request failed with status ${res.status}`);
      }
    }

    return await res.json();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.error(`[PMS API Client] Request to ${endpoint} timed out after ${REQUEST_TIMEOUT_MS}ms`);
      throw new Error(`Request timed out. Please try again.`);
    }
    console.warn(`[PMS API Client] Network request to ${endpoint} failed:`, err);
    throw err;
  }
}
