import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const state = useAuthStore.getState();
  const token = state.accessToken;

  // JWT (nếu backend thật dùng)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Mock server (server.ts) dùng headers này để xác định user
  if (state.user?.id) config.headers["x-user-id"] = state.user.id;
  if (state.user?.email) config.headers["x-user-email"] = state.user.email;
  if (state.user?.name) config.headers["x-user-name"] = state.user.name;

  return config;
});

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorised and retry with refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // In a real app, this would hit /auth/refresh which returns a new accessToken
        // and sets a new refreshToken cookie.
        const res = await axios.post("/api/auth/refresh");
        const { accessToken } = res.data;
        
        useAuthStore.getState().setToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
