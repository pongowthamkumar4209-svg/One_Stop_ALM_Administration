const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('alm_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  
  return res.json();
}

export const api = {
  auth: {
    login: (data: { serverUrl: string; username: string; password: string }) =>
      request<{ token: string; username: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
  },
  extract: {
    tests: (data: Record<string, unknown>) =>
      request('/extract/tests', { method: 'POST', body: JSON.stringify(data) }),
    defects: (data: Record<string, unknown>) =>
      request('/extract/defects', { method: 'POST', body: JSON.stringify(data) }),
  },
  update: {
    testType: (data: Record<string, unknown>) =>
      request('/update/test-type', { method: 'POST', body: JSON.stringify(data) }),
  },
  generate: {
    evidence: (data: Record<string, unknown>) =>
      request('/generate/evidence', { method: 'POST', body: JSON.stringify(data) }),
  },
  download: {
    attachments: (data: Record<string, unknown>) =>
      request('/download/attachments', { method: 'POST', body: JSON.stringify(data) }),
  },
  user: {
    provision: (data: Record<string, unknown>) =>
      request('/user/provision', { method: 'POST', body: JSON.stringify(data) }),
  },
  maintenance: {
    notify: (data: Record<string, unknown>) =>
      request('/maintenance/notify', { method: 'POST', body: JSON.stringify(data) }),
  },
  dashboard: {
    stats: () => request<Record<string, unknown>>('/dashboard/stats'),
    history: () => request<Record<string, unknown>[]>('/dashboard/history'),
  },
};
