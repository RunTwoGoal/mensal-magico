import axios from "axios";

/**
 * Base URL da API:
 * - Configure via .env: VITE_API_BASE_URL
 * - Fallback: http://localhost:8000
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: false, // altere para true se for usar cookies
});

/** Token em memória (não persiste entre reloads) */
let accessTokenMemory: string | null = null;

/** Setter para o AuthContext injetar/limpar token */
export const setAccessTokenInMemory = (token: string | null) => {
  accessTokenMemory = token;
};

/** (Opcional) getter, caso precise em algum lugar específico */
export const getAccessTokenInMemory = () => accessTokenMemory;

/** Interceptor: adiciona Authorization se houver token em memória */
api.interceptors.request.use((config) => {
  if (accessTokenMemory && config.headers) {
    config.headers.Authorization = `Bearer ${accessTokenMemory}`;
  }
  return config;
});

/** Interceptor de resposta: sem refresh; apenas repassa o erro */
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default api;