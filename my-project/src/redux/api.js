import axios from "axios";

const isProduction = window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
export const host = isProduction ? window.location.origin : "http://localhost:5110";
const API_BASE_URL = `${host}/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* TOKEN AUTO ATTACH */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* AUTO LOGOUT IF 401 */
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);