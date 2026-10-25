import type { User, AuthResponse, Vehicle, NewsArticle, CustomBuildConfig, CustomBuildResult } from '../types';

const API_BASE = '/api';

export const getStoredToken = (): string | null => {
  return localStorage.getItem('aura_token');
};

export const getStoredUser = (): User | null => {
  const userJson = localStorage.getItem('aura_user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

export const setSession = (token: string, user: User): void => {
  localStorage.setItem('aura_token', token);
  localStorage.setItem('aura_user', JSON.stringify(user));
};

export const clearSession = (): void => {
  localStorage.removeItem('aura_token');
  localStorage.removeItem('aura_user');
};

const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (includeAuth) {
    const token = getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Auth APIs
export const registerUser = async (data: { name: string; email: string; password: string; role?: 'customer' | 'admin' }): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Registration failed');
  setSession(json.token, json.user);
  return json;
};

export const loginUser = async (data: { email: string; password: string }): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Login failed');
  setSession(json.token, json.user);
  return json;
};

// Vehicle APIs
export const fetchVehicles = async (): Promise<Vehicle[]> => {
  const res = await fetch(`${API_BASE}/vehicles`, {
    headers: getHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch vehicles');
  return json.vehicles || [];
};

export const searchVehiclesApi = async (params: { make?: string; model?: string; category?: string; minPrice?: number; maxPrice?: number }): Promise<Vehicle[]> => {
  const query = new URLSearchParams();
  if (params.make) query.append('make', params.make);
  if (params.model) query.append('model', params.model);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
  if (params.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());

  const res = await fetch(`${API_BASE}/vehicles/search?${query.toString()}`, {
    headers: getHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to search vehicles');
  return json.vehicles || [];
};

export const createVehicleApi = async (data: Partial<Vehicle>): Promise<Vehicle> => {
  const res = await fetch(`${API_BASE}/vehicles`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create vehicle');
  return json.vehicle;
};

export const updateVehicleApi = async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
  const res = await fetch(`${API_BASE}/vehicles/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update vehicle');
  return json.vehicle;
};

export const deleteVehicleApi = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/vehicles/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete vehicle');
};

export const purchaseVehicleApi = async (id: string): Promise<Vehicle> => {
  const res = await fetch(`${API_BASE}/vehicles/${id}/purchase`, {
    method: 'POST',
    headers: getHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Purchase failed');
  return json.vehicle;
};

export const restockVehicleApi = async (id: string, quantity: number): Promise<Vehicle> => {
  const res = await fetch(`${API_BASE}/vehicles/${id}/restock`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ quantity }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Restock failed');
  return json.vehicle;
};

export const compareVehiclesApi = async (ids: string[]): Promise<Vehicle[]> => {
  const res = await fetch(`${API_BASE}/vehicles/compare?ids=${ids.join(',')}`, {
    headers: getHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to compare vehicles');
  return json.vehicles || [];
};

export const customBuildVehicleApi = async (config: CustomBuildConfig): Promise<CustomBuildResult> => {
  const res = await fetch(`${API_BASE}/vehicles/custom-build`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(config),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Custom build failed');
  return json;
};

// AI Concierge API
export const sendChatMessage = async (message: string): Promise<{ response: string; suggestedVehicles?: Vehicle[]; intent?: string }> => {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify({ message }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'AI concierge query failed');
  return json;
};

// News API
export const fetchNewsArticles = async (): Promise<NewsArticle[]> => {
  const res = await fetch(`${API_BASE}/news`, {
    headers: getHeaders(false),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch automotive news');
  return json.articles || [];
};
