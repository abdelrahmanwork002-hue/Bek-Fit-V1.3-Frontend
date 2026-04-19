import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://bekfitv13backend.vercel.app' 
    : (import.meta.env.VITE_API_URL || 'http://localhost:3001'),
  timeout: 15000,
});

let _token: string | null = null;

export const setApiToken = (token: string | null) => {
  _token = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getApiToken = () => _token;

export default api;
