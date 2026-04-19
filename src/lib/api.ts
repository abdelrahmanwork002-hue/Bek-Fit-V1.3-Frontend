import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bekfitv13backend.vercel.app',
  timeout: 30000,
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
