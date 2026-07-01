import axios from 'axios';
import {
  mockStats,
  mockPriorities,
  mockHeatmap,
  mockClusterDetail,
} from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
});

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

export const submitEntry = ({ text, language, lat, lng, photos, audio }) => {
  if (USE_MOCK) {
    console.log('[mock] submission:', { text, language, lat, lng, photos, audio });
    return delay({ status: 'received', submission_id: 'mock-' + Date.now() }, 800);
  }

  const formData = new FormData();
  if (text) formData.append('text', text);
  if (language) formData.append('language', language);
  if (lat != null) formData.append('lat', lat);
  if (lng != null) formData.append('lng', lng);
  (photos || []).forEach((file) => formData.append('photos', file));
  if (audio) formData.append('audio', audio, 'voice-note.webm');

  return api
    .post('/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);
};

export default api;