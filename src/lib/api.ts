import axios from 'axios';

const TOKEN_KEY = 'iua_admin_token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
});

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearToken();
      if (!window.location.pathname.startsWith('/connexion')) {
        window.location.href = '/connexion';
      }
    }
    return Promise.reject(error);
  },
);

/** Message d'erreur lisible depuis une réponse API (NestJS renvoie { message }). */
export function messageErreur(err: unknown, fallback = 'Une erreur est survenue'): string {
  const msg = (err as any)?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(', ');
  if (typeof msg === 'string') return msg;
  return fallback;
}
