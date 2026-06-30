import axios from 'axios';
import {
  mockStats,
  mockPriorities,
  mockHeatmap,
  mockClusterDetail,
} from './mockData';

// Set VITE_USE_MOCK=true in .env to develop the dashboard
// independently of the backend (see backend/routes/dashboard.py).
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
});

// Small helper to fake network latency in mock mode so loading
// states are actually visible during development.
const delay = (data, ms = 400) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const getPriorities = () =>
  USE_MOCK ? delay(mockPriorities) : api.get('/priorities').then((r) => r.data);

export const getHeatmap = () =>
  USE_MOCK ? delay(mockHeatmap) : api.get('/heatmap').then((r) => r.data);

export const getClusterDetail = (id) =>
  USE_MOCK ? delay(mockClusterDetail(id)) : api.get(`/cluster/${id}`).then((r) => r.data);

export const getStats = () =>
  USE_MOCK ? delay(mockStats) : api.get('/stats').then((r) => r.data);

export default api;