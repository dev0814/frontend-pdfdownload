import axios from 'axios';

const getBaseURL = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL;
  if (envBase) {
    return envBase.endsWith('/api') ? envBase : `${envBase.replace(/\/$/, '')}/api`;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export async function fetchPdfs() {
  const response = await api.get('/pdfs');
  return response.data;
}

export async function submitDownload(payload) {
  const response = await api.post('/download', payload);
  return response.data;
}

export default api;
